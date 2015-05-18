var express = require('express');
var router = express.Router();
var models = require('../models');

router.get('/check', function(req, res, next) {
	models.Day.find({}, function(err, days) {
		if(err) return err;
		if(days.length === 0) {
			var newDay = new models.Day();
			newDay.number = 1;
			newDay.save(function(err, day) {
				if(err) return err;
				res.send([day])
			})
		} else {
			res.send(days);
		}
	})
})

//adding day
router.get('/addday', function(req, res, next) {
	var newDay = new models.Day();
	models.Day.find({}, function(err, allDays){
		var total = allDays.length;
		newDay.number = total + 1;
		newDay.save(function(err, day) {
			if(err) return err;
			console.log('DAY', day);
			// day.populate('res')
			res.send(day);
			// newDay.populate('hotel restaurants thingToDo').exec(function(err, popDay) {
				// res.send(popDay)
			// });
		})
	});
})



//adding hotel to day
router.post('/addhotel', function(req, res, next) {
	var data = req.body;
	models.Day.findOne({number: data.day}, function(err, day) {
		if(err) return err
		day.hotel = req.body.hotel
		day.save(function(err, newDay) {
			if(err) return err;
			console.log('newDay', newDay);
			newDay.populate('hotel', function(err, popDay){
				res.send(popDay);
			})
		})
	})
})


router.post('/addrestaurant', function(req, res, next){ 
	var data = req.body;

	models.Day.findOne({number: data.day}, function(err, day) {
		if(err) return err
		day.restaurant.push(data.restaurant);
		day.save(function(err, day){
			if(err) return err
			res.send(day);
		});

	});

});


router.post('/addthing', function(req, res, next){ 
	var data = req.body;
	models.Day.findOne({number: data.day}, function(err, day) {
		if(err) return err
		day.thingToDo.push(data.thing);
		day.save(function(err, day){
			if(err) return err
			res.send(day);
		});

	});

});

router.post('/removehotel', function(req, res, next) {
	var day = req.body.dayToRemove;
	models.Day.findOne({number: day}, function(err, day) {

		day.hotel = null;
		day.save(function(err, day){
			res.send(day);
		})
	});
})
router.post('/removerestaurant', function(req, res, next) {
	var day = req.body.dayToRemove
	var rId = req.body.rId;
	models.Day.findOne({number: day}, function(err, day) {
		if(err) return err
		var index;

		day.restaurant.forEach(function(rest){
			console.log(rId);
			if(rId == rest) {
				console.log('EQUAL');
				index = day.restaurant.indexOf(rest)
			}
		})
		day.restaurant.splice(index, 1)
		day.save(function(err, newday) {
			if(err) return err
			res.send(newday);
		});
	})
});

router.post('/removething', function(req, res, next) {
	var day = req.body.dayToRemove
	var tId = req.body.tId;
	models.Day.findOne({number: day}, function(err, day) {
		if(err) return err
		var index;

		day.thingToDo.forEach(function(thing){
			if(tId == thing) {
				index = day.thingToDo.indexOf(thing)
			}
		})
		day.thingToDo.splice(index, 1)
		day.save(function(err, newday) {
			if(err) return err
			res.send(newday);
		});
	})
});
//adding restaurant to array for day

//adding thingstodo to array for day

//remove day



module.exports = router;