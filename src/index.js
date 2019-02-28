import {GraphQLServer} from 'graphql-yoga';

// Type definitions
const typeDefs = `
  type Query {
    hello: String!
    name: String!
    location: String!
    bio: String!
  }
`;

// Resolver
const resolvers = {
  Query: {
    hello() {
      return 'This is my first query!'
    },
    name() {
      return 'John Jacob JingleHeimer-Schmidt'
    },
    location() {
      return 'Boulder'
    },
    bio() {
      return 'I am Dev Lopper'
    }
  }
};

const server = new GraphQLServer({
  typeDefs,
  resolvers
});

server.start(() => {
  console.log('The server is up and running!');
});

