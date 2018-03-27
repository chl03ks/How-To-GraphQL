'use strict';

const { graphql, buildSchema }  = require('graphql');

const scheme = buildSchema(`
  type Query {
    foo: String
  }

  type Schema {
    query: Query
  }
`);

// The way that GraphQL knows how to return a value or what value to return, is through the idea of something called a resolver

const resolvers = {
  foo: () => 'bar',
};

const query = `
  query myFirstQuery {
    foo
  }
`;

graphql(scheme, query, resolvers)
.then(console.log)
.catch(console.error);
