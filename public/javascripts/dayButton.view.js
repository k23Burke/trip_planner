var DayButtonView = Backbone.View.extend({
  tagName: 'button',
  className: 'btn btn-circle day-clicker',
  render: function() {
    this.$el.html(app.temp_days.length); // admittedly still yucky
    return this; //for chaining
  }
});