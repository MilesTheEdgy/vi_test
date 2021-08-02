const graphql = require('graphql');
const mongoose = require("mongoose")
const sanitize = require('mongo-sanitize');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLInt,
    GraphQLFloat,
    GraphQLList,
    GraphQLNonNull
} = graphql;

const { 
    getUpdateIDSequence,
    verifyApplicationInput,
    verifyApplicationJoinInput,
    returnSellerBalance,
    returnBuyersList,
    updateSellerBalance,
    updateBuyersBalance
     } = require("./helpers")
const { authenticateToken } = require("../helpers/token")
const ApplicationModel = require("../models/application")
const CounterModel = require("../models/counter")
const TransactionModel = require("../models/transaction")
const { ApplicationType, JoinerArgumentType, TransactionType } = require("./types");

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addApplication: {
            type: ApplicationType,
            args: {
                product: {type: new GraphQLNonNull(GraphQLString)},
                goal: {type: new GraphQLNonNull(GraphQLInt)},
                unit_price: {type: new GraphQLNonNull(GraphQLFloat)},
                totalPrice: {type: new GraphQLNonNull(GraphQLFloat)},
                submitter_pledge: {type: new GraphQLNonNull(GraphQLInt)},
                conditionOn: {type: GraphQLInt},
                conditionGive: {type: GraphQLInt},
                description: {type: new GraphQLNonNull(GraphQLString)},
                finalDate: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve: async (parent, args, context) => {
                try {
                    const user = authenticateToken(context)
                    const { goal, conditionOn, conditionGive, unit_price, totalPrice, submitter_pledge } = args
                    const product = sanitize(args.product)
                    const description = sanitize(args.description)
                    const finalDate = sanitize(args.finalDate)
                    const productNameBarcodeSplitArr = product.split("--")
                    let verifyResult = await verifyApplicationInput(productNameBarcodeSplitArr, goal, unit_price, totalPrice, finalDate, submitter_pledge);
                    if (!verifyResult )
                        throw new Error("Could not verify your input")

                    let condition = ""
                    if (conditionOn === undefined || conditionGive === undefined)
                        condition = "NONE"
                    else
                        condition = `${conditionOn}+${conditionGive}`
                    let application = new ApplicationModel({
                        product_name: productNameBarcodeSplitArr[0],
                        product_barcode: productNameBarcodeSplitArr[1],
                        goal: goal,
                        condition: condition,
                        unit_price: unit_price,
                        submitter: user.pharmacyName,
                        submitter_pledge: submitter_pledge,
                        description: description,
                        final_date: finalDate,
                        application_id: await getUpdateIDSequence(CounterModel, "application_id"),
                        transaction_id: await getUpdateIDSequence(CounterModel, "transaction_id")
                    });
                    console.log(application)
                    await application.save();
                    return {
                        ...application._doc,
                        unit_price: application.unit_price.toString()
                    }
                } catch (error) {
                    console.error(error)
                    throw new Error("Unable to save your application")
                }
            }
        },
        joinApplication: {
            type: ApplicationType,
            args: {
                applicationID: {type: new GraphQLNonNull(GraphQLID)},
                pledge: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve: async (parent, args, context) => {
                try {
                    const user = authenticateToken(context)
                    const { pledge } = args
                    const applicationID = sanitize(args.applicationID)
                    const app = await ApplicationModel.findOne({application_id: applicationID})
                    if (app === null) throw new Error("Could not find an application with that ID")
                    const verifyResult = verifyApplicationJoinInput(app, user, pledge)
                    if (!verifyResult) throw new Error("Could not pass verification when joining bid")
                    app.joiners.push({name: user.pharmacyName, pledge: pledge})
                    await app.save()
                    return app
                } catch (error) {
                    console.log(error)
                    throw new Error("Could not join the existing application")
                }
            }
        },
        approveApplication: {
            type: ApplicationType,
            args: {
                applicationID: {type: new GraphQLNonNull(GraphQLID)},
                chosenJoiners: {type: new GraphQLNonNull(new GraphQLList(JoinerArgumentType))} //GraphQL doesn't accept normal objects as
                // Input types so I have to make my own "SPECIAL" Input object type and pass it here as an argument to the list. Great.
            },
            resolve: async (parent, args, context) => {
                try {
                    const user = authenticateToken(context)
                    const applicationID = sanitize(args.applicationID)
                    const app = await ApplicationModel.findOne({application_id: applicationID, submitter: user.pharmacyName || null})

                    ////////////////////////////////////// verification BEGINS //////////////////////////////////////////////////////////////////

                    if (app === null) throw new Error("Could not verify you as the owner of this application")
                    const { joiners, transaction_id, application_id, product_name, product_barcode, unit_price, submitter_pledge, goal, status } = app
                    if (status !== "ON_HOLD") throw new Error("Can not perform changes on an application that is approved or deleted")
                    if (joiners.length === 0) throw new Error("There are no joiners on this existing application")
                    let verifiedJoiners = []
                    let joinersTotalPledges = 0
                    for (let i = 0; i < joiners.length; i++) {
                        for (let j = 0; j < args.chosenJoiners.length; j++) {
                            if (args.chosenJoiners[j].name === joiners[i].name && args.chosenJoiners[j].pledge === joiners[i].pledge ) {
                                verifiedJoiners.push(joiners[i])
                                joinersTotalPledges = joinersTotalPledges + joiners[i].pledge
                            }
                        }
                    }
                    console.log(verifiedJoiners)
                    console.log(joinersTotalPledges)
                    if (joinersTotalPledges + submitter_pledge !== goal) throw new Error("Total of your goal and joiners combined did not match, or joiners did not verify. Could not approve.")

                    ////////////////////////////////////// verification ENDS //////////////////////////////////////////////////////////////////

                    const sellerAmount = goal - submitter_pledge
                    const sellerNewBalance = await returnSellerBalance(user, unit_price, sellerAmount)
                    const transac = new TransactionModel({
                        transaction_id: transaction_id,
                        application_id: application_id,
                        product: {
                            name: product_name,
                            barcode: product_barcode
                        },
                        unit_price: unit_price.toString(),
                        seller: {
                            name: user.pharmacyName,
                            amount: sellerAmount,
                            total: Number(unit_price.toString()) * sellerAmount,
                            balanceAfter: sellerNewBalance
                        },
                        buyers: await returnBuyersList(unit_price, verifiedJoiners)
                    })
                    app.status = "APPROVED"
                    app.status_change_date = Date.now()
                    const session = await mongoose.startSession();
                    await session.withTransaction(async () => {
                        await updateSellerBalance(user, sellerNewBalance, session)
                        await updateBuyersBalance(unit_price, verifiedJoiners, session)
                        await app.save({session})
                        await transac.save({session})
                      });
                    session.endSession()
                    return app
                } catch (error) {
                    console.log(error)
                    throw new Error("could not approve your application")
                }
            }
        },
        deleteApplication: {
            type: ApplicationType,
            args: {
                applicationID: {type: GraphQLID}
            },
            resolve: async (parent, args, context) => {
                try {
                    const user = authenticateToken(context)
                    const applicationID = sanitize(args.applicationID)
                    const app = await ApplicationModel.findOneAndDelete({application_id: applicationID, submitter: user.pharmacyName},
                         {select: {application: "removed"}})
                    if (app === null) throw new Error("Can not delete an application that is not yours")
                    return args
                } catch (error) {
                    console.error(error)
                    throw new Error("Could not delete your application")
                }
            }
        },
        deleteJoin: {
            type: ApplicationType,
            args: {
                applicationID: {type: GraphQLID}
            },
            resolve: async (parent, args, context) => {
                try {
                    const user = authenticateToken(context)
                    const applicationID = sanitize(args.applicationID)
                    const app = await ApplicationModel.findOne({
                        application_id: applicationID,
                        joiners:{$elemMatch:{name: user.pharmacyName}}
                    })
                    if (app === null) throw new Error("Could not find an application with that ID")
                    const removed = app.joiners.filter(el => el.name !== user.pharmacyName)
                    app.joiners = removed
                    await app.save()
                    return {...args, statusCode: 200}
                } catch (error) {
                    console.error(error)
                    throw new Error("Could not remove your bid join")
                }
            }
        }
    }
});

module.exports = Mutation