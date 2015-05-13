var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/wikistack');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongodb connection error:'));

var Place, Hotel, ThingToDo, Restaurant;
var Schema = mongoose.Schema;

//build schemas
var PlaceSchema = new Schema({
	address: String,
	city: String,
	state: String,
	phone: String,
	location: [Number]
})

var HotelSchema = new Schema({
	name: String,
	place: String,
	num_stars: {type: Number, min: 1, max: 5},
	amenities: String //(comma delimited string list)
})
HotelSchema.statics.delimiter = function(str){
	//stuff goes here
}

var ThingToDoSchema = new Schema({
	name: String,
	place: String,
	age_range: String// (data-type string)
})

var RestaurantSchema =  new Schema({
	name: String,
	place: String,
	cuisine: String,// (comma delimited string list)
	price: {type: Number, min:1, max:5}// (integer from 1-5 for how many dollar signs)
})


Place = mongoose.model('Place', PlaceSchema);
Hotel = mongoose.model('Hotel', HotelSchema);
ThingToDo = mongoose.model('ThingToDo', ThingToDoSchema);
Restaurant = mongoose.model('Restaurant', RestaurantSchema);

//exports
module.exports = {
	Place: Place,
	Hotel: Hotel,
	ThingToDo: ThingToDo,
	Restaurant: Restaurant
}