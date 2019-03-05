import {GraphQLServer} from 'graphql-yoga';
import uuidv4 from 'uuid/v4';

let comments = [
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

let users = [
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

let posts = [
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
    published: true,
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
  
  type Mutation {
    createUser(user: CreateUserInput): User!
    deleteUser(id: ID!): User!
    createPost(post: CreatePostInput): Post!
    createComment(comment: CreateCommentInput): Comment!
  }
  
  input CreateUserInput {
    name: String!
    email: String!
    age: Int
  }
  
  input CreatePostInput {
    title: String!
    body: String!
    published: Boolean!
    author: ID!
  }
  
  input CreateCommentInput {
    text: String!
    author: ID!
    post: ID!
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
  Mutation: {
    createUser(parent, args, ctx, info) {

      const emailTaken = users.some((user) => {
        return user.email === args.user.email;
      })

      if(emailTaken) {
        throw new Error(`${args.user.email} is already registered.`)
      }

      const user = {
        id: uuidv4(),
        ...args.user
      };

      users.push(user);

      return user;
    },
    deleteUser(parent, args, ctx, info) {
      const userIndex = users.findIndex((user) => user.id === args.id);

      if (userIndex === -1) {
        throw new Error('User not found');
      }

      const deletedUsers = users.splice(userIndex, 1);

      posts = posts.filter((post) => {
        const match = post.author === args.id;

        if (match) {
          comments = comments.filter((comment) => comment.post !== post.id);
        }

        return !match;
      });

      comments = comments.filter((comment) => comment.author !== args.id);

      return deletedUsers[0];
    },
    createPost(parent, args, ctx, info) {
      const userExists = users.some((user) => {
        return user.id === args.post.author;
      });

      if (!userExists) {
        throw new Error('User not found.')
      }

      const post = {
        id: uuidv4(),
        ...args.post
      };

      posts.push(post);

      return post;
    },
    createComment(parent, args, ctx, info) {
      const userExists = users.some((user) => {
        return user.id === args.comment.author;
      });

      const postExists = posts.some((post) => {
        return post.id === args.comment.post && post.published;
      })

      if (!userExists) {
        throw new Error('User not found.')
      }

      if (!postExists) {
        throw new Error('Post not found.')
      }

      const comment = {
        id: uuidv4(),
        ...args.comment
      };

      comments.push(comment);

      return comment;
    }
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
