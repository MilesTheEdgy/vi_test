const graphql = require('graphql');
const RootQuery = require("./query")
const Mutation = require("./mutation")

module.exports = new graphql.GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});