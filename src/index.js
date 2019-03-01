import {GraphQLServer} from 'graphql-yoga';


// 5 Scalar types in GraphQL - String, Boolean, Int, Float, ID
// Type definitions
const typeDefs = `
  type Query {
    me: User!
  }
  
  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
  }
`;

// Resolver
const resolvers = {
  Query: {
    me() {
      return {
        id: '123098',
        name: 'Michael',
        email: 'Michael@example.net'
      };
    },
  }
};

const server = new GraphQLServer({
  typeDefs,
  resolvers
});

server.start(() => {
  console.log('The server is up and running!');
});

