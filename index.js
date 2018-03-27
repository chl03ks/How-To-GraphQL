'use strict';

const { graphql, buildSchema }  = require('graphql');

const scheme = buildSchema(`
  type Query {
    id: ID, 
    title: String,
    duration: Int,
    watched: Boolean
  }

  type Schema {
    query: Query
  }
`);

// The way that GraphQL knows how to return a value or what value to return, is through the idea of something called a resolver

const resolvers = {
  id: () => '1',
  duration: () => 180,
  watched: () => true,
  title: () => 'bar',
};

const query = `
  query myFirstQuery {
    id,
    title,
    duration,
    watched
  }
`;

graphql(scheme, query, resolvers)
.then(console.log)
.catch(console.error);
