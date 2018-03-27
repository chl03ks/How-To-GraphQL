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
}  = require('graphql');

const { 
  globalIdField,
  connectionDefinitions,
  connectionFromPromisedArray,
  connectionArgs,
  mutationWithClientMutationId
} = require('graphql-relay');

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

const { connectionType: VideoConnection } = connectionDefinitions({
  nodeType: videoType,
  connectionFields: () => ({
    totalCount: {
      type: GraphQLInt,
      description: 'A count of the total number of objects in this connection.',
      resolve: (conn) => {
        return conn.edges.length;
      },
    },
  }),
});

const queryType = new GraphQLObjectType({
  name: 'QueryType',
  description: 'The root query type.',
  fields: {
    node: nodeField,
    videos: {
      type: VideoConnection,
      args: connectionArgs,
      resolve: (_m, args) => connectionFromPromisedArray(
        getVideos(),
        args
      ),
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

const videoMutation = mutationWithClientMutationId({
  name: 'AddVideo',
  inputFields: {
    title: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The title of the video.',
    },
    duration: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'The duration of the video (in seconds).',
    },
    watched: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: 'Whether or not the video is watched.',
    },
  },
  outputFields: {
    video: {
      type: videoType
    }
  },
  mutateAndGetPayload: (args) => new Promise((resolve, reject) => {
    Promise.resolve(createVideo(args))
      .then((video) => resolve({ video }))
      .catch(reject);
  }),
});

const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  description: 'The root Mutation type.',
  fields: {
    createVideo: videoMutation,
  },
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