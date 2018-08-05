function scrollBottom() {
  var conversation = jQuery('#conversation');
  var lastMessage = conversation.children('li:last-child');

  var scrollHeight = conversation.prop('scrollHeight');
  var clientHeight = conversation.prop('clientHeight');
  var scrollTop = conversation.prop('scrollTop');
  var lastMessageHeight = lastMessage.innerHeight();
  var SecondLastMessageHeight = lastMessage.prev().innerHeight();

  if(scrollTop + clientHeight + lastMessageHeight + SecondLastMessageHeight >= scrollHeight){
    conversation.prop('scrollTop', scrollHeight);
  }
}

var socket = io();
socket.on('connect', function() {
  var params = jQuery.deparam(window.location.search);
  socket.emit('join', params, function(err){
    if(err){
      alert(err);
      window.location.href = '/';
    } else{
      console.log('all good');
    }
  });
});

socket.on('disconnect', function() {
  console.log('disconnected from server');
});

socket.on('updateUserList', function(users){
  var ol = jQuery('<ol></ol>');
  users.forEach(function(user){
    ol.append(jQuery('<li></li>').text(user));
  });
  jQuery('#users').html(ol);
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
  scrollBottom();
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
  scrollBottom();
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