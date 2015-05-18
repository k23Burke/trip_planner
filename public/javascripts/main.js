






///////////////////////////////////
function initialize_gmaps() {
    // initialize new google maps LatLng object
    var myLatlng = new google.maps.LatLng(40.7223552,-73.974415);
    // set the map options hash
    var mapOptions = {
        center: myLatlng,
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    // get the maps div's HTML obj
    var map_canvas_obj = document.getElementById("map");
    // initialize a new Google Map with the options
    var map = new google.maps.Map(map_canvas_obj, mapOptions);
    return map;
}






$(document).ready(function() {
    var map = initialize_gmaps();

    //initalize firstDay
    $.ajax({
        type: 'GET',
        url: '/days/check',
        data:'',
        success: function(days) {
            console.log(days);
            var html = '';
            var btnhtml ='<button id="active-day" class="btn btn-circle day-clicker">1</button>';
            days.forEach(function(day) {
                if(days.indexOf(day) !== 0) {
                    html +='<div id="day-'+day.number+'" style="display:none;">';
                    btnhtml += '<button class="btn btn-circle day-clicker">'+day.number+'</button>';
                } else {
                    html +='<div id="day-'+day.number+'">';
                }
                html += '<h3>Hotel</h3><ul class="hotelForDay">';
                if(day.hotel) {
                    console.log(day.hotel);
                    all_hotels.forEach(function(hotelObject){
                        console.log(hotelObject);
                        if(hotelObject._id === day.hotel){
                            html += '<li>'+hotelObject.name+'<button class="removeItem btn btn-circle">x</button></li>';
                        }
                    });  
                }
                html += '</ul><h3>Restaurant</h3><ul class="restForDay">'
                if(day.restaurant.length > 0) {
                    day.restaurant.forEach(function(restaurant) {
                        all_restaurants.forEach(function(restaurantObject){
                            if(restaurantObject._id === restaurant){
                                html += '<li>'+restaurantObject.name+'<button class="removeItem btn btn-circle">x</button></li>';
                                
                            }
                        });  
                    })
                }
                html+= '</ul><h3>Things to Do</h3><ul class="thingsForDay">'

                if(day.thingToDo.length > 0) {
                    day.thingToDo.forEach(function(thingtodo) {
                        all_things_to_do.forEach(function(thingstodoObject) {
                            if(thingstodoObject._id === thingtodo) {
                                html+= '<li>'+thingstodoObject.name+'<button class="removeItem btn btn-circle">x</button></li>'
                            }
                        })
                    })
                }
                html +='</ul></div>';
            })
            $('#the-day').append(html);
            $('#addDay').before(btnhtml);
        }
    })

    // var TripView =  Backbone.View.extend();
    // var tripViewInstance = new TripView();
    // console.log(tripViewInstance.el);

    var htlimg = 'http://static.iconsplace.com/icons/preview/black/hotel-32.png';
    var rstimg = 'http://static.iconsplace.com/icons/preview/black/restaurant-32.png';
    var ttdimg = 'http://static.iconsplace.com/icons/preview/black/museum-32.png';

    var restMarker = function() { 
        return new google.maps.Marker({
                position: new google.maps.LatLng(0, 0),
                title:"",
                icon: rstimg
            })
    }

    var thingMarker = function() {
        return new google.maps.Marker({
                position: new google.maps.LatLng(0, 0),
                title:"",
                icon: ttdimg
            })
    }

    var bounds = new google.maps.LatLngBounds();
    function newBounds(newlatlng) {
        bounds.extend(newlatlng);
        map.fitBounds(bounds);
    }

    function removePossMarkers() {
        possObj.hotelMark.setMap(null)
        possObj.restMark.setMap(null)
        possObj.thingMark.setMap(null)
    }

    function removeAllMarkersExceptDay(daynum) {
        dayArray.forEach(function(day) {
            if((daynum - 1) !== dayArray.indexOf(day)) {
                day.hotelMark.setMap(null);
                day.restMark.forEach(function(restMarker) {
                    restMarker.setMap(null)
                })
                day.thingMark.forEach(function(thingMarker) {
                    thingMarker.setMap(null)
                })
                possObj.thingMark.setMap(null);
                possObj.hotelMark.setMap(null);
                possObj.restMark.setMap(null);
                $("#possHotel option").filter(function() {
                   return $(this).text() == "--"
                }).attr('selected', true);
                $("#possRest option").filter(function() {
                   return $(this).text() == "--"
                }).attr('selected', true);
                $("#possThing option").filter(function() {
                   return $(this).text() == "--"  
                }).attr('selected', true);
            } else {
                day.hotelMark.setMap(map);
                day.restMark.forEach(function(restMarker) {
                    restMarker.setMap(map)
                })
                day.thingMark.forEach(function(thingMarker) {
                    thingMarker.setMap(map)
                })
            }
        })
    }

    //initializing trip days
    function tripObj(){
        this.hotel = null;
        this.rest = [];
        this.thing = [];
        //markers
        this.hotelMark = new google.maps.Marker({
            position: new google.maps.LatLng(0, 0),
            title:"",
            icon: htlimg
        });
        this.restMark = [];
        this.thingMark = []
    }
    var possObj = {
        hotelMark: new google.maps.Marker({
            position: new google.maps.LatLng(0, 0),
            title:"",
            icon: htlimg
        }),
        restMark: restMarker(),
        thingMark: thingMarker()
    }
    var dayArray = [new tripObj()]


    function initializeEmptyMarker() {

    }

    function findActiveDay() {
        var d = $('#active-day').text();
        return d;
    }
    function createADay(){
        dayArray.push(new tripObj());
        // console.log(dayArray)
    }

    var h = $(window).height();
    $('#map').height(h - 50);
    $('#sidebar').height(h - 70);


    $('#hotelSelector').click(function(){
        var day = findActiveDay();
        var hName = $('#possHotel option:selected').text();
        var hId = $('#possHotel').val();
        // if(dayArray[day-1].hotel === null && hName !== "--") {
            var hName = $('#possHotel option:selected').text();
            var elem = $('#day-'+day).find(".hotelForDay");
            elem.append('<li>'+hName+'<button class="removeItem btn btn-circle">x</button></li>');
            // dayArray[day-1].hotel = hName;

            //make AJAX request to add hotel to day
            $.ajax({
                type:'POST',
                url: '/days/addhotel',
                data: 'day='+day+'&hotel='+hId,
                success: function(response) {
                    //perform something with response

                    console.log(response);
                }
            })

            console.log('day='+day+'&hotel='+hId);

            // var lat;
            // var lon;
            // all_hotels.forEach(function(hotelObject){
            //     if(hotelObject.name === hName){
            //         lat = hotelObject.place[0].location[0]
            //         lon = hotelObject.place[0].location[1]
            //     }
            // });            

            //clear possible hotelmarker
            // possObj.hotelMark.setMap(null);

            //set selected hotel marker
            // dayArray[day-1].hotelMark.position = new google.maps.LatLng(lat,lon);
            // newBounds(dayArray[day-1].hotelMark.position);
            // dayArray[day-1].hotelMark.title = hName;
            // console.log(dayArray[day-1].hotelMark)
            // dayArray[day-1].hotelMark.setMap(map);
            $("#possHotel option").filter(function() {
                return $(this).text() == "--"
            }).attr('selected', true);

        // } else {
        //     possObj.hotelMark.setMap(null);
        //     if(hName !== "--") {
        //         alert('Make your selection');
        //     } else {
        //         alert('You already booked a Hotel');
        //     }
        //     $("#possHotel option").filter(function() {
        //         return $(this).text() == "--"
        //     }).attr('selected', true);


        // }
    })

    $('#restaurantSelector').click(function(){
        var day = findActiveDay();
        var hName = $('#possRest  option:selected').text();
        if(dayArray[day-1].rest.length < 3 && hName !== "--") {
            
            
            if(dayArray[day-1].rest.indexOf(hName) === -1 ){
                var elem = $('#day-'+day).find(".restForDay");
                elem.append('<li>'+hName+'<button class="removeItem btn btn-circle">x</button></li>');
                dayArray[day-1].rest.push(hName); 
                var lat;
                var lon;
                all_restaurants.forEach(function(restaurantObject){
                    if(restaurantObject.name === hName){
                        lat = restaurantObject.place[0].location[0]
                        lon = restaurantObject.place[0].location[1]
                    }
                });

                var rId = $('#possRest  option:selected').val();


                $.ajax({
                    type:'POST',
                    url: '/days/addrestaurant',
                    data: 'day='+day+'&restaurant='+rId,
                    success: function(response) {
                        //perform something with response

                        console.log(response);
                    }
                })

                //clear possible hotelmarker
                possObj.restMark.setMap(null);
                var newMark = restMarker();
                newMark.position = new google.maps.LatLng(lat,lon);
                newBounds(newMark.position);

                newMark.title = hName;
                newMark.setMap(map);
                dayArray[day-1].restMark.push(newMark);
                //resets select
                $("#possRest option").filter(function() {
                    return $(this).text() == "--"
                }).attr('selected', true);
            }else{
                alert(hName+' is good, but not that good!')
            }
        } else {
            possObj.restMark.setMap(null);
            if(hName !== "--") {
                alert('Make your selection');
            } else {
                alert('You\'ve booked three restaurants!');
            }
            $("#possRest option").filter(function() {
                return $(this).text() == "--"
            }).attr('selected', true);
        }
    })

    $('#thingSelector').click(function(){
        var day = findActiveDay();
        var hName = $('#possThing  option:selected').text();
        if(dayArray[day-1].thing.length < 4 && hName !== "--") {
            
            
            if(dayArray[day-1].thing.indexOf(hName) === -1 ){

                var elem = $('#day-'+day).find(".thingsForDay");
                elem.append('<li>'+hName+'<button class="removeItem btn btn-circle">x</button></li>');
                dayArray[day-1].thing.push(hName);

                var lat;
                var lon;
                all_things_to_do.forEach(function(thingObject){
                    if(thingObject.name === hName){
                        lat = thingObject.place[0].location[0]
                        lon = thingObject.place[0].location[1]
                    }
                });       

                var tId =  $('#possThing  option:selected').val();

                $.ajax({
                    type:'POST',
                    url: '/days/addthing',
                    data: 'day='+day+'&thing='+tId,
                    success: function(response) {
                        //perform something with response

                        console.log(response);
                    }
                })     

                //clear possible hotelmarker
                possObj.thingMark.setMap(null);
                var newMark = thingMarker();
                newMark.position = new google.maps.LatLng(lat,lon);
                newBounds(newMark.position);
                newMark.title = hName;
                newMark.setMap(map);
                dayArray[day-1].thingMark.push(newMark);
                //resets select
                $("#possThing option").filter(function() {
                    return $(this).text() == "--"
                }).attr('selected', true);
            }else{
                alert('You\'re boring!');
            }
        } else {
            possObj.thingMark.setMap(null);
            if(hName !== "--") {
                alert('Make your selection');
            } else {
                alert('You already have four things to do today!');
            }
            $("#possThing option").filter(function() {
                return $(this).text() == "--"
            }).attr('selected', true);
        }
    })
    $('#addDay').click(function(){
        //create day in db
        var daynum;
        $.ajax({
            type: 'GET',
            url: '/days/addday',
            success:function(newday){
                console.log(newday);
                daynum = newday.number;
                console.log(daynum);
                var oldDay = findActiveDay();

                //hide oldDay markers on map
                removeAllMarkersExceptDay(daynum)
                removePossMarkers();

                //hide oldDay html
                $('#day-'+oldDay).css('display', 'none');
                $('#active-day').removeAttr('id');

                //display newday html
                var html = '<div id="day-'+daynum+'">';
                html +='<h3>Hotel</h3>';
                html += '<ul class="hotelForDay">';
                html += '</ul>';
                html += '<h3>Restaurant</h3>';
                html += '<ul class="restForDay">';
                html += '</ul>';
                html += '<h3>Things to Do</h3>';
                html += '<ul class="thingsForDay">';
                html += '</ul>';
                html += '</div>';
                $('#the-day').append(html);
                $('#day-number').text(daynum);
                //create new button day
                var newbtn = $('#addDay').before('<button id="newbtn" class="btn btn-circle day-clicker">'+daynum+'</button>');
                // console.log('HERE');
                $('#newbtn').attr('id', 'active-day');
                // console.log('THERE');
                $('#remove-day').css('display','inline-block');
            }
        });
    })

    $('#the-day').on('click', '.removeItem', function() {
        removePossMarkers();
        var value = $(this).parent().text()
        value = value.slice(0, -1);
        // console.log(value)
        // remove item from day obj
        //get dayid
        // $('#day-1').parent();
        var id = $(this).parent().parent().parent('div').attr('id');
        //console.log(id);
        id = parseInt(id.slice(-1));
        var dayToRemove = $('#active-day').text();
        if($(this).parent().parent('ul').hasClass('hotelForDay')) {
            dayArray[id-1].hotel = null;
            dayArray[id-1].hotelMark.setMap(null);


            //ajax to remove hotel from db
            $.ajax({
                type: 'POST',
                url: 'days/removehotel',
                data: 'dayToRemove=' + dayToRemove,
                success: function(data){
                    //console.log(data);
                }
            })


        } else if ($(this).parent().parent('ul').hasClass('restForDay')) {
            var index;
            var rId;

            all_restaurants.forEach(function(restaurantObject){
                if(restaurantObject.name === value){
                    rId = restaurantObject._id;
                }
            });  

            //ajax to remove hotel from db
            $.ajax({
                type: 'POST',
                url: 'days/removerestaurant',
                data: 'dayToRemove=' + dayToRemove + '&rId='+rId,
                success: function(data){
                    console.log(data);
                }
            })
            // dayArray[id-1].rest.forEach(function(restaurant) {
            //     if(value === restaurant) {
            //         index = dayArray[id-1].rest.indexOf(restaurant);
            //     }
            // })
            // dayArray[id-1].rest.splice(index, 1);
            // dayArray[id-1].restMark[index].setMap(null);
            // dayArray[id-1].restMark.splice(index, 1);
        } else if ($(this).parent().parent('ul').hasClass('thingsForDay')) {
            var index;

            all_things_to_do.forEach(function(thingObject){
                if(thingObject.name === value){
                    tId = thingObject._id;
                }
            }); 
            //ajax to remove hotel from db
            $.ajax({
                type: 'POST',
                url: 'days/removething',
                data: 'dayToRemove=' + dayToRemove + '&tId='+tId,
                success: function(data){
                    console.log(data);
                }
            }) 
            // dayArray[id-1].thing.forEach(function(thing) {
            //     if(value === thing) {
            //         index = dayArray[id-1].thing.indexOf(thing);
            //     }
            // })
            // dayArray[id-1].thing.splice(index, 1);
            // dayArray[id-1].thingMark[index].setMap(null);
            // dayArray[id-1].thingMark.splice(index, 1);
        }
        // remove item from DOM
        $(this).parent().remove()
    });

    $('#list-days').delegate(".day-clicker", "click", function() {
        //use this to get the day to change to
        var day = parseInt($(this).text());
        removeAllMarkersExceptDay(day)
        if(day < dayArray.length) {
            $('#remove-day').css('display','none');
        } else if(day === dayArray.length) {
            $('#remove-day').css('display','inline-block');
        }

        //use findActive day to hide the days html
        var actDay = findActiveDay();
        $('#day-'+actDay).css('display', 'none');

        //show day of clicked button
        $('#day-'+day).css('display', 'block');
        $('#active-day').removeAttr("id");
        $(this).attr("id", "active-day");
        $('#day-number').text(day);
        if(dayArray.length === 1){
            $('#remove-day').css('display','none');
        }
    })

    $('#remove-day').click(function(){
        //store the number


        //change day number
        if(dayArray.length > 1){
            $('#day-number').text(parseInt($('#day-number').text())-1);
        }
        //select previous day active button
        // $('').click()
        $('#active-day').prev().attr('id','active-day');
        //remove day button
        $("#active-day").next().remove();
        //remove the day html
        $('#day-'+dayArray.length).remove();
        //remove from dayArray
        var index = dayArray.length - 1;
        // dayArray[index].hotelMark.setMap(null);
        dayArray[index].hotelMark.setMap(null);
        dayArray[index].restMark.forEach(function(restMarker) {
            restMarker.setMap(null)
        })
        dayArray[index].thingMark.forEach(function(thingMarker) {
            thingMarker.setMap(null)
        })
        dayArray.pop();
        //display previous day html
        $('#day-'+dayArray.length).css('display','block')
        //are we at day 1?  if so, remove 'remove day ' button
        if(dayArray.length === 1){

            $('#remove-day').css('display','none');
        }
        removeAllMarkersExceptDay(dayArray.length);
    })


    //function to handle select changes, to create markers and expand map
    //if you select an item, it will show up on the map.  if you add it, the select marker should disappear.  
    //if you've completed your final item it should disable select markers

    $("#possHotel").change(function(){
        var hotName = $('#possHotel option:selected').text()
        if(hotName !== "--") {
            var lat;
            var lon;
            all_hotels.forEach(function(hotelObject){
                if(hotelObject.name === hotName){
                    lat = hotelObject.place[0].location[0]
                    lon = hotelObject.place[0].location[1]
                }
            });
            possObj.hotelMark.position = new google.maps.LatLng(lat, lon);
            newBounds(possObj.hotelMark.position);
            possObj.hotelMark.title= hotName;
            possObj.hotelMark.setMap(map);
        } else {
            possObj.hotelMark.setMap(null);
        }
    })
    $("#possRest").change(function(){
        // var restName = $(this).val()
        var restName = $('#possRest option:selected').text()
        if(restName !== "") {
            var lat;
            var lon;
            all_restaurants.forEach(function(restaurantObject){
                if(restaurantObject.name === restName){
                    lat = restaurantObject.place[0].location[0]
                    lon = restaurantObject.place[0].location[1]
                }
            });
            possObj.restMark.position = new google.maps.LatLng(lat, lon);
            newBounds(possObj.restMark.position);
            possObj.restMark.title = restName;
            possObj.restMark.setMap(map);
        } else {
            possObj.restMark.setMap(null);
        }
    })
    $("#possThing").change(function(){
        // var thingName = $(this).val()
        var thingName = $('#possThing option:selected').text()
        if(thingName !== "") {
            var lat;
            var lon;
            all_things_to_do.forEach(function(thingObject){
                if(thingObject.name === thingName){
                    lat = thingObject.place[0].location[0]
                    lon = thingObject.place[0].location[1]
                }
            });  
            possObj.thingMark.position = new google.maps.LatLng(lat, lon);
            newBounds(possObj.thingMark.position);
            possObj.thingMark.title = thingName;
            possObj.thingMark.setMap(map);
        } else {
            possObj.thingMark.setMap(null);
        }
    })


    $("#eyeSelect").click(function(){
           $("#sidebar").fadeToggle()
           $("#sidebar-ontop").fadeToggle()
    })


//BACKBONE STUFF



});
// var app = {
//     dayInstance: new Day(),
//     temp_days: new DaysCollection(),
//     tripViewInstance: null
// }
// app.tripViewInstance = new TripView();
// console.log(app.temp_days);


// TripView.initialize = function(){
//       console.log(app.temp_days);  

//       this.listenTo(app.temp_days, 'add', this.createDayBtn);
// }

// TripView.initialize();

// TripView.createDayBtn = function() {
//   //<yuck>
//       this.$el.find('#list-days').append('<button class="btn btn-default btn-primary">Day ' + app.temp_days.length + '</button>');
//   //</yuck>
// }

// function printer(str) {
//     console.log(str);
// }

// AJAXmaker('GET', '/days', '', printer);



// function AJAXmaker(verb, url, data, cb) {
//     $.ajax({
//         type: verb,
//         url: url,
//         data: data,
//         succes: function(response) {
//             console.log('response', response)
//         }
//     });
// }


//adding day

//adding hotel to day

//adding restaurant to array for day

//adding thingstodo to array for day

//remove day






