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
    // Add the marker to the map
    var htlimg = 'http://static.iconsplace.com/icons/preview/black/hotel-32.png';
    var rstimg = 'http://static.iconsplace.com/icons/preview/black/restaurant-32.png';
    var ttdimg = 'http://static.iconsplace.com/icons/preview/black/museum-32.png';

    var hLatLng = new google.maps.LatLng(40.707119, -74.003602);
    var hmarker = new google.maps.Marker({
        position: hLatLng,
        title:"Hotel",
        icon: htlimg
    });
    var rLatLng = new google.maps.LatLng(40.71919, -74.003602);
    var rmarker = new google.maps.Marker({
        position: rLatLng,
        title:"Restaurant",
        icon: rstimg
    });
    var tLatLng = new google.maps.LatLng(40.718679, -74.008900);
    var tmarker = new google.maps.Marker({
        position: tLatLng,
        title:"Things",
        icon: ttdimg
    });
    // Add the marker to the map by calling setMap()
    hmarker.setMap(map);
    rmarker.setMap(map);
    tmarker.setMap(map);
}






$(document).ready(function() {
    initialize_gmaps();

    //initializing trip days
    function tripObj(){
        this.hotel = null;
        this.rest = [];
        this.thing = [];
    }
    var dayArray = [new tripObj()]

    function findActiveDay() {
        var d = $('#active-day').text();
        return d;
    }
    function createADay(){
        dayArray.push(new tripObj());
        console.log(dayArray)
    }

    var h = $(window).height();
    $('#map').height(h - 50);
    $('#sidebar').height(h - 70);


    $('#hotelSelector').click(function(){
        var day = findActiveDay();
        if(dayArray[day-1].hotel === null) {
            var hName = $('#possHotel').val();
            var elem = $('#day-'+day).find(".hotelForDay");
            elem.append('<li>'+hName+'</li>');
            dayArray[day-1].hotel = hName;
        } else {
            alert('You already booked a Hotel');
        }
    })

    $('#restaurantSelector').click(function(){
        var day = findActiveDay();
        if(dayArray[day-1].rest.length < 3) {
            var hName = $('#possRest').val();
            
            if(dayArray[day-1].rest.indexOf(hName) === -1 ){
                var elem = $('#day-'+day).find(".restForDay");
                elem.append('<li>'+hName+'</li>');
                dayArray[day-1].rest.push(hName); 
            }else{
                alert(hName+' is good, but not that good!')
            }
        } else {
            alert('You\'ve booked three restaurants!');
        }
    })

    $('#thingSelector').click(function(){
        var day = findActiveDay();
        if(dayArray[day-1].thing.length < 4) {
            var hName = $('#possThing').val();
            
            if(dayArray[day-1].thing.indexOf(hName) === -1 ){

                var elem = $('#day-'+day).find(".thingsForDay");
                elem.append('<li>'+hName+'</li>');
                dayArray[day-1].thing.push(hName);
            }else{
                alert('You\'re boring!');
            }
        } else {
            alert('You already have four things to do today!');
        }
    })
    $('#addDay').click(function(){
        if(dayArray.length < 7){
            createADay();
            var day = findActiveDay();

            //create the new day button
            var newbtn = $(this).before('<button id="newbtn" class="btn btn-circle day-clicker">'+dayArray.length+'</button>');
            $('#day-'+day).css('display', 'none');
            //remove id active day
            $('#active-day').removeAttr('id');
            //create the newday html
            var html = '<div id="day-'+dayArray.length+'">';
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

            //add id active day to the active new day button
            $('#newbtn').attr('id', 'active-day');

        }

    })

    $('#list-days').delegate(".day-clicker", "click", function() {
        //use this to get the day to change to
        var day = $(this).text();

        //use findActive day to hide the days html
        var actDay = findActiveDay();
        $('#day-'+actDay).css('display', 'none');

        //show day of clicked button
        $('#day-'+day).css('display', 'block');
        $('#active-day').removeAttr("id");
        $(this).attr("id", "active-day");
    })
});






