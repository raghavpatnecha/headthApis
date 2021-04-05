// this is similar to routes in express
const { buildSchema } = require('graphql');

module.exports = buildSchema(`

    type TestData{
        text:String!
        views:Int!
    }
    type RootQuery{
        hello:TestData
    }
    type Post{
        _id:ID!
        title:String!
        content:String!
        imageUrl:String!
        creator:User!
        createdAt:String!
        updatedAt:String!
    }
    type User{
        _id:ID!
        name:String!
        email:String!
        password:String
        status:String!
        posts:[Post!]!
    }
    type AllHistory{
        mobile:String
        status:Int
        msg:String
    }
    input UserInputData{
        title:String!
        mobile:String!
        description:String!
    }
    type RootMutation{
        createHistory(userInput:UserInputData):AllHistory
    }
    schema {
            query:RootQuery
            mutation:RootMutation
    }
`);