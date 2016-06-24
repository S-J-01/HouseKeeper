// Set pin 5 as output on lamp control module
$.getq('queue', '/lamp_control/mode/4/o');

$(document).ready(function() {

  // Function to control lamp
  $("#1").click(function() {
    $.getq('queue', '/lamp_control/digital/4/1');
  });

  $("#2").click(function() {
    $.getq('queue', '/lamp_control/digital/4/0');
  });

  // Get data from DHT sensor
  function refresh_dht() {
  	$.getq('queue', '/lamp_control/temperature', function(data) {
      $('#temperature').html("Temperature: " + data.temperature + " C");	
    });

    $.getq('queue', '/lamp_control/humidity', function(data) {
      $('#humidity').html("Humidity: " + data.humidity + " %");
    });
  }
  refresh_dht();
  setInterval(refresh_dht, 10000);

  // Get data from motion sensor
  function refresh_motion() {
    $.getq('queue', '/motion', function(data) {
      if (data.state == 0) {$('#motion').html("No motion detected");}
      if (data.state == 1) {

        // Change text
        $('#motion').html("Motion detected");

        // Play sound if alarm is on
        $.get('/alarm', function(data) {
          if (data.state == 1) {$.playSound('/audio/alarm');}
        });
        
      } 
    });
  }
  refresh_motion();
  setInterval(refresh_motion, 500);

  // Init alarm button
  $.get('/alarm', function(data) {
    var alarm_state = data.state;
    
    if (alarm_state == 1) {
      $('#alarm').html("Alarm On");
      $('#alarm').attr('class', 'btn btn-block btn-lg btn-success');
      //alarm_state = 1;
    }

    if (alarm_state == 0) {
      $('#alarm').html("Alarm Off");
      $('#alarm').attr('class', 'btn btn-block btn-lg btn-danger');
     // alarm_state =0;
    }
  });

  // Click on alarm button
  $('#alarm').click(function() {

    // Get alarm state
    $.get('/alarm', function(data) {
      var alarm_state = data.state;
// alarm_state!=alarm_state;
      if (alarm_state == 0) {
        $.post('/alarm?state=1');
        $('#alarm').html("Alarm On");
        $('#alarm').attr('class', 'btn btn-block btn-lg btn-success');
      }

      if (alarm_state == 1) {
        $.post('/alarm?state=0');
        $('#alarm').html("Alarm Off");
        $('#alarm').attr('class', 'btn btn-block btn-lg btn-danger');
      }
    });

  });

});