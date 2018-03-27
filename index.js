'use strict';

const { graphql, buildSchema }  = require('graphql');

//  What we've created here is a field called videos that returns a GraphQL List type of the Video type
const scheme = buildSchema(`
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
// We'll create a variable called videoA that holds all the fields of a Video type. We'll also go and create a Video called videoB

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

// Now that we have our collection of videos, let's go and update our resolvers. Now we have a videos field, so we need to be able to tell our GraphQL schema how to actually resolve the videos field

const resolvers = {
  video: () => ({
    id: '1',
    title: 'bar',
    duration: 180,
    watched: true,
  }),
  videos: () => videos,
};

// We can then update our query that we have down here by just changing a single letter instead of requesting the video field

const query = `
  query myFirstQuery {
    videos {
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
