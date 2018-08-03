var socket = io();
socket.on('connect', function() {
  console.log('Connect to server');
});

socket.on('disconnect', function() {
  console.log('disconnected from server');
});

socket.on('newMessage', function(message){
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = jQuery('#message-template').html();
  var html = Mustache.render(template, {
    from: message.from,
    createdAt: formattedTime,
    text: message.text
  });

  jQuery('#conversation').append(html);
});

socket.on('newLocationMessage', function(message){
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = jQuery('#location-message-template').html();
  var html = Mustache.render(template, {
    from: message.from,
    createdAt: formattedTime,
    url: message.url
  });

  jQuery('#conversation').append(html);
});



jQuery('#message-form').on('submit', function(e){
  e.preventDefault();
  var messageTextbox = jQuery('input[name=message]');
  socket.emit('createMessage', {
    from: 'User',
    text: messageTextbox.val()
  }, function(data){
    messageTextbox.val('');
  });
});

var locationButton = jQuery('#send-location');
locationButton.on('click', function(){
  if(!navigator.geolocation){
    return alert('Geolocation is not supported by your browser.')
  }

  locationButton.attr('disabled', true).text('Sending location...');
  navigator.geolocation.getCurrentPosition(function(position){
    locationButton.attr('disabled', false).text('Send location');
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude, 
      longitude: position.coords.longitude
    });
  }, function(){
    locationButton.attr('disabled', false).text('Send location');
    alert('Unable to fetch location');
  });
});