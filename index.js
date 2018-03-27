'use strict';

const express = require('express');
const graphqlHttp = require('express-graphql');
const { 
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLList,
  GraphQLBoolean,
  GraphQLID,
  GraphQLString,
  GraphQLInputObjectType,
  GraphQLInt
}  = require('graphql')
const { globalIdField } = require('graphql-relay');

const { getVideoById, getVideos, createVideo }  = require('./src/data');

const {  nodeInterface, nodeField } = require('./src/node');

const PORT = process.env.PORT || 3000;
const server = express();

const videoType = new GraphQLObjectType({
  name: 'Video',
  description: 'a video on egghead.io',
  fields: {
    id: globalIdField(),
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
  },
  interfaces: [nodeInterface],
});

const queryType = new GraphQLObjectType({
  name: 'QueryType',
  description: 'The root query type.',
  fields: {
    node: nodeField,
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

const videoInputType = new GraphQLInputObjectType({
  name: 'VideoInput',
  fields: {
    title: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The title of the video'
    },
    duration: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'The duration of the video in seconds',
    },
    watched: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: 'Wheather or not the viewer has watched the video.'
    },
  }
});

const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  description: 'The rooot Mutation type.',
  fields: {
    createVideo: {
      type: videoType,
      args: {
        video: {
          type: new GraphQLNonNull(videoInputType),
        },
      },
      resolve: (_, args) => createVideo(args.video)
    }
  }
});

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

module.exports = { videoType };