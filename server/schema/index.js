const graphql = require('graphql');
const {GraphQLSchema, GraphQLID, GraphQLList, GraphQLNonNull} = require("graphql/type");
const _ = require('lodash');
const {GraphQLObjectType, GraphQLString, GraphQLInt} = graphql;
const Book = require('../models/book')
const Author = require('../models/author')

const BookType = new GraphQLObjectType({
    name: 'Book', fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        genre: {type: GraphQLString},
        year: {type: GraphQLInt},
        author: {
            type: AuthorType,
            resolve(parent) {
                return Author.findById(parent.authorId);
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
                return Book.find({
                    authorId: parent.id
                });
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
                return Book.findById(args.id);
            }
        },
        author: {
            type: AuthorType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args) {
                return Author.findById(args.id);
            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve() {
                return Book.find();
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve() {
                return Author.find({});
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addAuthor: {
            type: AuthorType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},
                age: {type: new GraphQLNonNull(GraphQLInt)},
            },
            resolve(parent, args) {
                const author = new Author({
                    name: args.name,
                    age: args.age,
                });
                return author.save();
            }
        },
        addBook: {
            type: BookType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},
                year: {type: new GraphQLNonNull(GraphQLInt)},
                genre: {type: new GraphQLNonNull(GraphQLString)},
                authorId: {type: GraphQLID},
            },
            resolve(parent, args) {
                const book = new Book({
                    name: args.name,
                    year: args.year,
                    genre: args.genre,
                    authorId: args.authorId,
                });
                return book.save();
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation,
})