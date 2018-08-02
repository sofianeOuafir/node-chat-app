const expect = require('expect');

var {generateMessage, generateLocationMessage} = require('./message.js');

describe('generateMessage', () => {
  it('should generate the correct message object', () => {
    var from = 'Sofiane', text = 'Hello World';
    var message = generateMessage(from, text);
    expect(message.from).toEqual(from);
    expect(message.text).toEqual(text)
    expect(typeof message.createdAt).toBe('number');
  });
});

describe('generateLocationMessage', () => {
  it('should generate correct message location object', () => {
    var from = 'User', latitude = 1, longitude = 1;
    locationMessage = generateLocationMessage('User', latitude, longitude);
    expect(typeof locationMessage.createdAt).toBe('number');
    expect(locationMessage).toMatchObject({
      from,
      url: 'https://www.google.com/maps?q=1,1'
    });
  });
})