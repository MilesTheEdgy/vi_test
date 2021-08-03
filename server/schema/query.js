const graphql = require('graphql');
const bcrypt = require("bcrypt")
const sanitize = require('mongo-sanitize');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLList,
    GraphQLNonNull,
    GraphQLBoolean
} = graphql;

const {
    escapeStringRegexp,
    mapUnitPriceToStringArray
     } = require("./helpers")
const { generateAccessToken, authenticateToken } = require("../helpers/token")
const UserModel = require("../models/user")
const ApplicationModel = require("../models/application")
const ProductModel = require("../models/product")
const { ApplicationType, UserType, ProductType, LoginType, TestType } = require("./types");

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        test: {
            type: TestType,
            resolve: () => {
                return {
                    message: "THIS IS WORKING!!!",
                    random: 69
                }
            }
        },
        argtest: {
            type: TestType,
            args: {input: {type: GraphQLString}},
            resolve: (parent, args) => {
                return {
                    message: "lmao babe fuck you your input is: " + args.input,
                    random: 69
                }
            }
        },
        login: {
            type: LoginType,
            args: {
                username: {type: new GraphQLNonNull(GraphQLString)},
                password: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve: async (parent, {username, password}) => {
                try {
                    const res = await UserModel.findOne({username: username})
                    if (res === null) {
                        throw new Error("Your username or password was incorrect")
                    }
                    const passwordValid = await bcrypt.compare(password, res.hash);
                    if (!passwordValid) {
                        throw new Error("Your username or password was incorrect")
                    } else {
                        let token = generateAccessToken(res.username, res.pharmacy_name)
                        const convertBalanceToNum = {
                            ...res._doc,
                            password,
                            balance: res.balance.toString(),
                            token: {
                                username: res.username,
                                pharmacy_name: res.pharmacy_name,
                                role: "eczane",
                                token: token
                            }
                        }
                        return convertBalanceToNum
                    }
                } catch (error) {
                    console.error(error)
                    throw new Error("Unable to verify your username and password, please check your info")
                }
            }
        },
        currentUser: {
            type: UserType,
            resolve: async (parent, args, context) => {
                try {
                    const user = authenticateToken(context)
                    const query = await UserModel.findOne({pharmacy_name: user.pharmacyName})
                    return {
                        ...query._doc,
                        balance: query.balance.toString()
                    }
                } catch (error) {
                    console.log(error)
                    throw new Error("Could not fetch your information")
                }
            }
        },
        user: {
            type: UserType,
            args: {
                pharmacyName: {type: new GraphQLNonNull(GraphQLString) }
            },
            resolve: async (parent, { pharmacyName }, context) => {
                try {
                    authenticateToken(context)
                    const query = await UserModel.findOne({pharmacy_name: pharmacyName})
                    console.log(query)
                    if (query == null) throw new Error ("your pharmacy name query did not match in database")
                    return {
                        ...query._doc,
                        balance: query.balance.toString()
                    }
                } catch (error) {
                    console.log(error)
                    throw new Error("Could not fetch this user's information")
                }
            }
        },
        users: {
            type: new GraphQLList(UserType),
            resolve: async (parent, args, context) => {
                authenticateToken(context)
                const query = await UserModel.find({})
                const mapped = query.map(obj => {
                    return {
                        ...obj._doc,
                        balance: obj.balance.toString()
                    }
                })
                return mapped
            }
        },
        product: {
            type: new GraphQLList(ProductType),
            args: {
                searchCriteria: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve: async (parent, args, context) => {
                try {
                    authenticateToken(context)
                    const searchCriteriaArr = args.searchCriteria.split("")
                    let isString = false
                    for (let i = 0; i < searchCriteriaArr.length; i++) {
                        if (isNaN(searchCriteriaArr[i])) {
                            isString = true
                            break;
                        }
                    }
                    if (isString) {
                        const $regex = escapeStringRegexp(args.searchCriteria.toUpperCase());
                        return await ProductModel.find({ Product_name: { $regex } });
                    } else {
                        const $regex = escapeStringRegexp(args.searchCriteria);
                        return await ProductModel.find({ Barcode: { $regex } });
                    }
                } catch (error) {
                    console.log(error)
                    throw new Error("could not fetch product list")
                }
            }
        },
        products: {
            type: new GraphQLList(ProductType),
            resolve: async (parent, args, context) => {
                authenticateToken(context)
                return await ProductModel.find({})
            }
        },
        application: {
            type: new GraphQLList(ApplicationType),
            args: {
                applicationID: {type: GraphQLID},
                submitter: {type: GraphQLString},
                onHold: {type: GraphQLBoolean}
            },
            resolve: async (parent, args, context) => {
                try {
                    authenticateToken(context)
                    if (args.onHold) {
                        if (args.submitter) {
                            const submitter = sanitize(args.submitter)
                            const res = ApplicationModel.find({submitter: submitter, status: "ON_HOLD"})
                            return mapUnitPriceToStringArray(res)
                        }
                        const res = await ApplicationModel.find({status: "ON_HOLD"})
                        return mapUnitPriceToStringArray(res)
                    }
                    if (args.applicationID) {
                        const applicationID = sanitize(args.applicationID)
                        const res = await ApplicationModel.findOne({application_id: applicationID})
                        return mapUnitPriceToStringArray(res)
                    }
                    else if (args.submitter) {
                        const submitter = sanitize(args.submitter)
                        const res = await ApplicationModel.find({submitter: submitter})
                        return mapUnitPriceToStringArray(res)
                    }
                } catch (error) {
                    console.error(error)
                    throw new Error("Unable To Fetch Applications")
                }
            }
        },
        applications: {
            type: ApplicationType,
            resolve: async (parent, args, context) => {
                try {
                    authenticateToken(context)
                    const res = await ApplicationModel.find({})
                    return mapUnitPriceToStringArray(res)
                } catch (error) {
                    console.error(error)
                    throw new Error("Could not fetch applications data")
                }
            }
        }
    }
});

module.exports = RootQuery