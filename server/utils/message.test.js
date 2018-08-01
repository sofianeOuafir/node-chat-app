const expect = require('expect');

var {generateMessage} = require('./message.js');

describe('generateMessage', () => {
  it('should generate the correct message object', () => {
    var from = 'Sofiane', text = 'Hello World';
    var message = generateMessage(from, text);
    expect(message.from).toEqual(from);
    expect(message.text).toEqual(text)
    expect(typeof message.createdAt).toBe('number');
  });
});