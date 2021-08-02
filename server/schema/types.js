const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLInt, GraphQLFloat, GraphQLList, GraphQLInputObjectType } = require("graphql");


const TokenType = new GraphQLObjectType({
    name: "Token",
    fields: () => ({
        username: { type: GraphQLString },
        pharmacy_name: { type: GraphQLString },
        role: { type: GraphQLString },
        token: { type: GraphQLString },
    })
})

const LoginType = new GraphQLObjectType({
    name: 'Login',
    fields: () => ({
        username: { type: GraphQLString },
        password: { type: GraphQLString },
        token: {type: TokenType},
    })
});

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        username: { type: GraphQLString },
        pharmacy_name: { type: GraphQLString },
        balance: {type: GraphQLFloat},
    })
});

const ProductType = new GraphQLObjectType({
    name: "Product",
    fields: () => ({
        Product_name: {type: GraphQLString},
        Barcode: {type: GraphQLString},
        ATC_code: {type: GraphQLString}
    })
})

const ApplicationType = new GraphQLObjectType({
    name: "Application",
    fields: () => ({
        application_id: {type: GraphQLInt},
        transaction_id: {type: GraphQLInt},
        product_name: {type: GraphQLString},
        product_barcode: {type: GraphQLString},
        goal: {type: GraphQLInt},
        condition: {type: GraphQLString},
        unit_price: {type: GraphQLString},
        submitter: {type: GraphQLString},
        submitter_pledge: {type: GraphQLInt},
        description: {type: GraphQLString},
        status: {type: GraphQLString},
        joiners: {type: new GraphQLList(JoinersType)},
        submit_date: {type: GraphQLString},
        final_date: {type: GraphQLString},
        status_change_date: {type: GraphQLString}
    })
})

const TransInfoType = new GraphQLObjectType({
    name: "TransactionInfo",
    fields: () => ({
        name: {type: GraphQLString},
        amount: {type: GraphQLInt},
        total: {type: GraphQLFloat},
        balanceAfter: {type: GraphQLFloat}
    })
})

const TransactionType = new GraphQLObjectType({
    name: "Transaction",
    fields: () => ({
        application_id: {type: GraphQLInt},
        transaction_id: {type: GraphQLInt},
        product: {type: ProductType},
        unit_price: {type: GraphQLString},
        seller: {type: TransInfoType},
        buyers: {type: new GraphQLList(TransInfoType)},
        date: {type: GraphQLString}
    })
})

const JoinersType = new GraphQLObjectType({
    name: "Joiner",
    fields: () => ({
        name: {type: GraphQLString},
        pledge: {type: GraphQLInt}
    })
})


// I hate graphql...
const JoinerArgumentType = new GraphQLInputObjectType({
    name: "JoinerArg",
    fields: () => ({
        name: {type: GraphQLString},
        pledge: {type: GraphQLInt}
    })
})

module.exports = {
    UserType,
    ApplicationType,
    ProductType,
    JoinersType,
    JoinerArgumentType,
    LoginType,
    TransactionType
}