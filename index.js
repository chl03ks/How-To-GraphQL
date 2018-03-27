'use strict';

const express = require('express');
const graphqlHttp = require('express-graphql');

const { graphql, buildSchema }  = require('graphql');

const PORT = process.env.PORT || 3000;
const server = express();

//  What we've created here is a field called videos that returns a GraphQL List type of the Video type
const schema = buildSchema(`
  type Video {
    id: ID, 
    title: String,
    duration: Int,
    watched: Boolean
  }

  type Query {
    video: Video
    videos: [Video]
  }

  type Schema {
    query: Query
  }
`);

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

const resolvers = {
  video: () => ({
    id: '1',
    title: 'bar',
    duration: 180,
    watched: true,
  }),
  videos: () => videos,
};

server.use('/graphql', graphqlHttp({
  schema, 
  graphiql: true,
  rootValue: resolvers,
  })
);

server.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));