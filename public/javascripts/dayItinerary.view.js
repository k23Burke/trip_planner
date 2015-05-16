var DayItineraryView = Backbone.View.extend({
	buildHTML : _.template($("#itinerary_template").html()),
	render: function() {
		console.log('GET HERE');
	    this.setElement(this.buildHTML({dayNum: app.temp_days.length})); // admittedly still yucky
	    return this; //for chaining
	}
});