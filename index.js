'use strict';

const express = require('express');
const graphqlHttp = require('express-graphql');
const { getVideoById, getVideos, createVideo }  = require('./src/data');
const { 
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLList,
  GraphQLBoolean,
  GraphQLID,
  GraphQLString,
  GraphQLInt
}  = require('graphql');

const PORT = process.env.PORT || 3000;
const server = express();

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
    },
  }
});

const queryType = new GraphQLObjectType({
  name: 'QueryType',
  description: 'The root query type.',
  fields: {
    videos: {
      type: new GraphQLList(videoType),
      resolve: getVideos,
    },
    video: {
      type: videoType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
          description: 'the id of the video'
        }
      },
      resolve: (_, args) => getVideoById(args.id),
    }
  }
});

const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  description: 'The rooot Mutation type.',
  fields: {
    createVideo: {
      type: videoType,
      args: {
        title: {
          type: new GraphQLNonNull(GraphQLString),
          description: 'The title of the video'
        },
        duration: {
          type: GraphQLNonNull(GraphQLInt),
          description: 'The duration of the video in seconds',
        },
        watched: {
          type: GraphQLNonNull(GraphQLBoolean),
          description: 'Wheather or not the viewer has watched the video.'
        }
      },
      resolve: (_, args) => createVideo(args)
    }
  }
})
const schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType
})

server.use('/graphql', graphqlHttp({
  schema, 
  graphiql: true,
  })
);

server.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`)
});