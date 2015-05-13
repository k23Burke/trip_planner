var express = require('express');
var router = express.Router();
var models = require('../models');

/* GET home page. */
router.get('/', function(req, res, next) {
	models.Hotel.find(function(err, hotels) {
		models.Restaurant.find(function(err, restaurants) {
			models.ThingToDo.find(function(err, things) {
				res.render('index', { 
					hotels: hotels,  
					restaurants: restaurants,
					things: things
				});
				
			})
		})
	})
});


module.exports = router;
