
const {
  GraphQLInterfaceType,
  GraphQLNonNull,
  GraphQLID,
} = require('graphql');

const { videType } = require('../index');

const nodeInterface = new GraphQLInterfaceType({
  name: 'node',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    }
  },
  resolveType: (object) => {
    if(object.title) {
      return videType;
    }
  }
});

module.exports = nodeInterface;