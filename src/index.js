import {GraphQLServer} from 'graphql-yoga';

const comments = [
    {
      id: '1',
      text: 'text for 1',
      author: '3',
      post: '1'
    },{
      id: '2',
      text: 'text for 2',
      author: '3',
      post: '2'
    },{
      id: '3',
      text: 'text for 3',
      author: '3',
      post: '3'
    },{
      id: '4',
      text: 'text for 4',
      author: '1',
      post: '2'
    }
];

const users = [
    {
      id: '1',
      name: 'Mekala Deanne Smith',
      email: 'mekala@smith.com',
      age: 57
    },{
      id: '2',
      name: 'Michael Gene McClendon',
      email: 'mgm@yahoo.com'
    },{
      id: '3',
      name: 'William Kyle McClendon',
      email: 'cal@gmail.com'
    }
];

const posts = [
  {
    id: '1',
    title: 'This is a title',
    body: 'Body of the post is here.',
    published: true,
    author: '3'
  },{
    id: '2',
    title: 'E equals MC Squared',
    body: 'Albert Einstein',
    published: false,
    author: '1'
  },{
    id: '3',
    title: 'The Law of Murphy',
    body: 'Murphy had many laws.  This one is the Best.',
    published: false,
    author: '2'
  }
];


// 5 Scalar types in GraphQL - String, Boolean, Int, Float, ID
// Type definitions
const typeDefs = `
  type Query {
    me: User!
    post: Post!
    posts(query: String): [Post!]!
    users(query: String): [User!]!
    comments: [Comment!]!
  }
  
  type Comment {
    id: ID!
    text: String!
    author: User!
    post: Post!
  }
  
  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
    comments: [Comment!]!
  } 
  
  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
    comments: [Comment!]!
  }
`;

// Resolvers
const resolvers = {
  Query: {
    me() {
      return {
        id: '123098',
        name: 'Michael',
        email: 'Michael@gmail.com'
      };
    },
    post() {
      return {
        id: '123487',
        title: 'The Thing',
        body: 'Lorem Ipsum',
        published: true,
        author: '2'
      }
    },
    posts(parent, args, ctx, info) {
      if (!args.query) {
        return posts;
      } else {
        return posts.filter((post) => {
          const isTitleMatch = post.title.toLowerCase().includes(args.query.toLowerCase());
          const isBodyMatch = post.body.toLowerCase().includes(args.query.toLowerCase());
          return isBodyMatch || isTitleMatch;
        });
      }
    },
    users(parent, args, ctx, info) {
      if (!args.query) {
        return users;
      } else {
        return users.filter((user) => {
          return user.name.toLowerCase().includes(args.query.toLowerCase());
        })
      }
    },
    comments(parent, args, ctx, info) {
      return comments;
    },
  },
  Post: {
    author(parent, args, ctx, info) {
      return users.find((user) => {
        return user.id === parent.author;
      })
    },
    comments(parent, args, ctx, info) {
      return comments.filter((comment) => {
        return comment.post === parent.id;
      })
    }
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter((post) => {
        return post.author === parent.id;
      })
    },
    comments(parent, args, ctx, info) {
      return comments.filter((comment) => {
        return comment.author === parent.id;
      })
    }
  },
  Comment: {
    author(parent, args, ctx, info) {
      return users.find((user) => {
        return user.id === parent.author;
      })
    },
    post(parent, args, ctx, info) {
      return posts.find((post) => {
        return post.id === parent.post;
      })
    }
  },
};

const server = new GraphQLServer({
  typeDefs,
  resolvers
});

server.start(() => {
  console.log('The server is up and running!');
});
