const expect = require('expect');

const {Users} = require('./users.js');
var users = new Users();

beforeEach(() => {
  users.users = [{
    id: '1',
    name: 'Mike',
    room: 'Room 1'
  }, {
    id: '2',
    name: 'Fred',
    room: 'Room 2'
  }, {
    id: '3',
    name: 'Andrew',
    room: 'Room 1'
  }];
});


describe('addUser', () => {
  it('should add a user', () => {
    var users = new Users();
    var user = {
      id: 1,
      name: 'Sofiane',
      room: 'Room 1'
    };
    users.addUser(user.id, user.name, user.room);
    expect(users.users).toEqual([user]);
  });
});

describe('getUser', () => {
  it('should return the right user', () => {
    var userId = '1';
    var user = users.getUser(userId);
    expect(user.id).toEqual(userId);
  });

  it('should return undefined when the id do not match with any user', () => {
    var userId = '99';
    var user = users.getUser(userId);
    expect(user).toBeUndefined();
  });
});

describe('removeUser', () => {
  it('should remove a user when the user id exist', () => {
    var userId = '1';
    users.removeUser(userId);
    expect(users.users.length).toBe(2);
  });

  it('should not remove a user when the user id do not match any user', () => {
    var userId = '99';
    var user = users.removeUser(userId);
    expect(users.users.length).toBe(3);
    expect(user).toBeUndefined();
  });
});

describe('getAllUser', () => {
  it('should return an array of users in a given room', () => {
    var names = users.getAllUser('Room 1');
    expect(names).toEqual(['Mike', 'Andrew']);
  });

  it('should return an array of users in a given room', () => {
    var names = users.getAllUser('Room 2');
    expect(names).toEqual(['Fred']);
  });
});