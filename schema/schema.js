const graphql = require('graphql');
const _ = require('lodash');

const User = require('../models/user');
const Hotel = require('../models/hotel');
const Cell = require('../models/cell');

const { 
  GraphQLObjectType, 
  GraphQLString, 
  GraphQLSchema,
  GraphQLID,
  GraphQLInt, 
  GraphQLList,
  GraphQLNonNull
} = graphql;

const defaultID = '000000000000000000000000';

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
  	id: { type: GraphQLID },
  	name: { type: GraphQLString },
  	purse: { type: GraphQLInt },
  	password: { type: GraphQLString },
  	cells: {
  	  type: new GraphQLList(CellType),
  	  resolve(parent, args) {
  	  	return Cell.find({available: parent.id});
  	  }
  	}
  })
});

const HotelType = new GraphQLObjectType({
  name: 'Hotel',
  fields: () => ({
  	id: { type: GraphQLID },
  	name: { type: GraphQLString },
  	description: { type: GraphQLString },
  	cells: {
  	  type: new GraphQLList(CellType),
  	  resolve(parent, args) {
  	  	return Cell.find({idHotel: parent.id});
  	  }
  	}
  })
});

const CellType = new GraphQLObjectType({
  name: 'Cell',
  fields: () => ({
  	id: { type: GraphQLID },
  	number: { type: GraphQLInt },
  	name: { type: GraphQLString },
  	cost: { type: GraphQLInt },
  	hotel: {
  	  type: HotelType,
  	  resolve(parent, args){
  	  	return Hotel.findById(parent.idHotel);
  	  }
  	},
  	user: {
  	  type: UserType,
  	  resolve(parent, args){
  	  	return User.findById(parent.available);
  	  }
  	}
  })
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
  	user: {
  	  type: UserType,
  	  args: { id: {type: GraphQLID }},
  	  resolve(parent, args){
  	  	return User.findById(args.id)
  	  }
  	},
  	hotel: {
  	  type: HotelType,
  	  args: { id: {type: GraphQLID }},
  	  resolve(parent, args){
  	  	return Hotel.findById(args.id);
  	  }
  	},
  	cell: {
  	  type: CellType,
  	  args: { id: {type: GraphQLID }},
  	  resolve(parent, args){
  	  	return Cell.findById(args.id);
  	  }
  	},
  	users: {
  	  type: GraphQLList(UserType),
  	  resolve(parent, args) {
  	  	return User.find({});
  	  }
  	},
  	hotels: {
  	  type: GraphQLList(HotelType),
  	  resolve(parent, args) {
  	  	return Hotel.find({});
  	  }
  	},
  	cells: {
  	  type: GraphQLList(CellType),
  	  resolve(parent, args) {
  	  	return Cell.find({});
  	  }
  	}
  }
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
  	addHotel: {
  	  type: HotelType,
  	  args: {
  	  	name: { type: new GraphQLNonNull(GraphQLString) },
  	  	description: { type: new GraphQLNonNull(GraphQLString) }
  	  },
  	  resolve(parent, args){
  	  	let hotel = new Hotel({
  	  	  name: args.name,
  	  	  description: args.description
  	  	});
  	  	return hotel.save();
  	  }
  	},
  	addUser: {
  	  type: UserType,
  	  args: {
  	  	name: { type: new GraphQLNonNull(GraphQLString) },
  	  	purse: { type: new GraphQLNonNull(GraphQLInt) },
  	  	password: { type: new GraphQLNonNull(GraphQLString) }
  	  },
  	  resolve(parent, args){
  	  	let user = new User({
  	  	  name: args.name,
  	  	  purse: args.purse,
  	  	  password: args.password
  	  	});
  	  	return user.save();
  	  }
  	},
  	addCell: {
  	  type: CellType,
  	  args: {
  	  	number: { type: new GraphQLNonNull(GraphQLInt) },
  		name: { type: new GraphQLNonNull(GraphQLString) },
  		cost: { type: new GraphQLNonNull(GraphQLInt) },
  		idHotel: { type: new GraphQLNonNull(GraphQLID) },
  		available: { type: GraphQLNonNull(GraphQLID) }
  	  },
  	  resolve(parent, args) {
  	  	let cell = new Cell({
  	  	  number: args.number,
  	  	  name: args.name,
  	  	  cost: args.cost,
  	  	  idHotel: args.idHotel,
  	  	  available: args.available == '0' ? defaultID : args.available
  	  	});
  	  	return cell.save();
  	  }
  	},
    updateCell: {
      type: CellType,
      args: {
        id: { name: 'id', type: new GraphQLNonNull(GraphQLID) },
        available: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve(parent, args) {
        return Cell.findByIdAndUpdate(
        	args.id, 
          { $set: { available: args.available } },
          { new: true }
        ).catch(err => new Error(err));
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});

// mutation {
// 	updateCell(id:"5d4bd8efca67e203b0858840", available:"0d4bd8wfca67e203b0158840"){
// 		id
//   }
// }

