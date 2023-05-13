const graphql = require('graphql');
const {GraphQLSchema, GraphQLID, GraphQLList} = require("graphql/type");
const _ = require('lodash');

const {GraphQLObjectType, GraphQLString, GraphQLInt} = graphql;

const books = [
    {
        "name": "Eleanor Armstrong",
        "genre": "Rap",
        "year": 2007,
        "id": "1",
        "authorId": "1",
    },
    {
        "name": "Victoria Bailey",
        "genre": "Country",
        "year": 2007,
        "id": "2",
        "authorId": "2",
    },
    {
        "name": "Priscilla Jones",
        "genre": "World",
        "year": 2001,
        "id": "3",
        "authorId": "3",
    },
    {
        "name": "Loren Gibson",
        "genre": "Folk",
        "year": 2020,
        "id": "4",
        "authorId": "3",
    }
]

const authors = [
    {
        "name": "Mathew Stiedemann",
        "age": 51,
        "id": "1"
    },
    {
        "name": "Amanda Murphy",
        "age": 30,
        "id": "2"
    },
    {
        "name": "Kelley Reinger",
        "age": 61,
        "id": "3"
    },
    {
        "name": "Stewart Daniel",
        "age": 26,
        "id": "4"
    }
];

const BookType = new GraphQLObjectType({
    name: 'Book', fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        genre: {type: GraphQLString},
        year: {type: GraphQLInt},
        author: {
            type: AuthorType,
            resolve(parent) {
                return _.find(authors, {id: parent.authorId});
            }
        }
    })
});

const AuthorType = new GraphQLObjectType({
    name: 'Author', fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
        books: {
            type: new GraphQLList(BookType),
            resolve(parent) {
                return _.filter(books, {authorId: parent.id});
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        book: {
            type: BookType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args) {
                return _.find(books, {id: args.id});
            }
        },
        author: {
            type: AuthorType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args) {
                return _.find(authors, {id: args.id});
            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve() {
                return books;
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve() {
                return authors;
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
})