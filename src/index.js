import {GraphQLServer} from 'graphql-yoga';


// 5 Scalar types in GraphQL - String, Boolean, Int, Float, ID
// Type definitions
const typeDefs = `
  type Query {
    title: String!
    price: Float!
    releaseYear: Int
    rating: Float
    isStock: Boolean!
  }
`;

// Resolver
const resolvers = {
  Query: {
    title() {
      return 'The Tao of Pooh';
    },
    price() {
      return 12.99;
    },
    releaseYear() {
      return 1998;
    },
    rating() {
      return null;
    },
    isStock() {
      return true;
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

