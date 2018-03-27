'use strict';

const express = require('express');
const graphqlHttp = require('express-graphql');

const { 
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLBoolean,
  GraphQLID,
  GraphQLString,
  GraphQLInt
}  = require('graphql');

const PORT = process.env.PORT || 3000;
const server = express();

//  What we've created here is a field called videos that returns a GraphQL List type of the Video type
const videoType = new GraphQLObjectType({
  name: 'Video',
  description: 'a video on egghead.io',
  fields: {
    id: {
      type: GraphQLID,
      description: 'the id of the video'
    },
    title: {
      type: GraphQLString,
      description: 'The title of the video'
    },
    duration: {
      type: GraphQLInt,
      description: 'The duration of the video in seconds',
    },
    watched: {
      type: GraphQLBoolean,
      description: 'Wheather or not the viewer has watched the video.'
    }
  }
});

const queryType = new GraphQLObjectType({
  name: 'QueryType',
  description: 'The root query type.',
  fields: {
    video: {
      type: videoType,
      resolve: () => new Promise(resolve => resolve({
        id: 'a',
        title: 'GraphQl',
        duration: 180,
        watched: false
      })),
    }
  }
});


const schema = new GraphQLSchema({
  query: queryType,
})

const videoA = {
  id: '1',
  title: 'Youtube',
  duration: 180,
  watched: true,
};

const videoB = {
  id: '1',
  title: 'Vimeo',
  duration: 180,
  watched: true,
};

const videos = [ videoA, videoB ];

server.use('/graphql', graphqlHttp({
  schema, 
  graphiql: true, // graphiql is just a visual editor, or a visual IDE, for dealing with GraphQL schemas
  })
);

server.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));