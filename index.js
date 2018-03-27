'use strict';

const { graphql, buildSchema }  = require('graphql');

const scheme = buildSchema(`
  type Video {
    id: ID, 
    title: String,
    duration: Int,
    watched: Boolean
  }

  type Query {
    video: Video
  }

  type Schema {
    query: Query
  }
`);

// The way that GraphQL knows how to return a value or what value to return, is through the idea of something called a resolver

const resolvers = {
  video: () => ({
    id: '1',
    title: 'bar',
    duration: 180,
    watched: true,
  }),
};

const query = `
  query myFirstQuery {
    video {
      id,
      title,
      duration,
      watched
    }
  }
`;

graphql(scheme, query, resolvers)
.then(console.log)
.catch(console.error);
