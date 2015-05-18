var express = require('express');
var router = express.Router();
var models = require('../models');
var async = require('async');

var Promise = require('bluebird');

/* GET home page. */
//standard
// router.get('/', function(req, res, next) {
// 	models.Hotel.find(function(err, hotels) {
// 		models.Restaurant.find(function(err, restaurants) {
// 			models.ThingToDo.find(function(err, things) {
// 				res.render('index', { 
// 					hotels: hotels,  
// 					restaurants: restaurants,
// 					things: things
// 				});
				
// 			})
// 		})
// 	})
// });

//with slow promises
// router.get('/', function(req, res, next) {
// 	models.Hotel
// 		.find()
// 		.exec()
// 		.then(function(hotels) {
// 			res.locals.hotels = hotels
// 			return models.Restaurant.find().exec()
// 		})
// 		.then(function(restaurants) {
// 			res.locals.restaurants = restaurants
// 			return models.ThingToDo.find().exec()
// 		})
// 		.then(function(thingsToDo) {
// 			res.locals.thingsToDo = thingsToDo
// 			res.render('index', res.locals); //res.locals refers to object created above
// 		})
// });

//fast promises
// router.get('/', function(req, res, next) {
// 	Promise.join(
// 		models.Hotel.find().exec()
// 		models.Restaurant.find().exec()
// 		models.ThingToDo.find().exec()
// 		)
// 	.then(spread(function(hotels, restaurants, thingsToDo) {
// 		res.render('index', {
// 			hotels:hotels,
// 			restaurants:restaurants,
// 			thingsToDo:thingsToDo
// 		})
// 	}))
// });

//parallel
router.get('/', function(req, res, next) {
	async.parallel({
		hotels: function(done) {
			models.Hotel.find(done)
		},
		restaurants: function(done) {
			models.Restaurant.find(done)
		},
		things_to_do: function(done) {
			models.ThingToDo.find(done)
		}
	},function(err, resultsHash) {
		// console.log(resultsHash.hotels[0].place);
		// var place = JSON.parse(resultsHash.hotels[0].place);
		// console.log(place.location)\
		res.render('index', resultsHash)
	})
});


module.exports = router;
