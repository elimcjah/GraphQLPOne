import {GraphQLServer, PubSub} from 'graphql-yoga';
import db from './db';
import Comment from './resolvers/Comment';
import Mutation from './resolvers/Mutation';
import Post from './resolvers/Post';
import Query from './resolvers/Query';
import Subscription from './resolvers/Subscription';
import User from './resolvers/User';

const pubSub = new PubSub();

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers: {
    Comment,
    Mutation,
    Post,
    Query,
    Subscription,
    User
  },
  context: {
    db,
    pubSub
  }
});

server.start(() => {
  console.log('The server is up and running!');
});
