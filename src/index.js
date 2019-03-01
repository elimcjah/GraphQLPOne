import {GraphQLServer} from 'graphql-yoga';


// 5 Scalar types in GraphQL - String, Boolean, Int, Float, ID
// Type definitions
const typeDefs = `
  type Query {
    add(a: Float!, b: Float!): Float!
    greeting(name: String, position: String): String!
    me: User!
    post: Post!
  }
  
  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
  }
  
  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
  }
`;

// Resolver
const resolvers = {
  Query: {
    add(parent, args, ctx, info) {
      if (args.a && args.b) {
        return args.a + args.b;
      } else {
        return '2 Numbers are required';
      }
    },
    me() {
      return {
        id: '123098',
        name: 'Michael',
        email: 'Michael@example.net'
      };
    },
    post() {
      return {
        id: '123487',
        title: 'The Thing',
        body: 'Lorem Ipsum',
        published: true
      }
    },
    greeting(parent, args, ctx, info) {
      if (args.name && args.position) {
        return `Jello ${args.name}! You are my favorite ${args.position}!`;
      } else {
        return 'Jello';
      }
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

