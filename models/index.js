var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/wikistack');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongodb connection error:'));

var Place, Hotel, ThingToDo, Restaurant, Day;
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
	place: [PlaceSchema],
	num_stars: {type: Number, min: 1, max: 5},
	amenities: String //(comma delimited string list)
})
HotelSchema.statics.delimiter = function(str){
	//stuff goes here
}

var ThingToDoSchema = new Schema({
	name: String,
	place: [PlaceSchema],
	age_range: String// (data-type string)
})

var RestaurantSchema =  new Schema({
	name: String,
	place: [PlaceSchema],
	cuisine: String,// (comma delimited string list)
	price: {type: Number, min:1, max:5}// (integer from 1-5 for how many dollar signs)
})

var DaySchema = new Schema({
	number: Number,
	hotel: {type: mongoose.Schema.Types.ObjectId, ref: 'Hotel'},
	restaurant: [{type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant'}],
	thingToDo: [{type: mongoose.Schema.Types.ObjectId, ref: 'ThingToDo'}]
})


Place = mongoose.model('Place', PlaceSchema);
Hotel = mongoose.model('Hotel', HotelSchema);
ThingToDo = mongoose.model('ThingToDo', ThingToDoSchema);
Restaurant = mongoose.model('Restaurant', RestaurantSchema);
Day = mongoose.model('Day', DaySchema);

//exports
module.exports = {
	Place: Place,
	Hotel: Hotel,
	ThingToDo: ThingToDo,
	Restaurant: Restaurant,
	Day: Day
}