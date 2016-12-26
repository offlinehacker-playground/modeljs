[![Build Status](https://travis-ci.org/offlinehacker/modeljs.png)](https://travis-ci.org/offlinehacker/modeljs)

# ModelJS

Domain driven designed base models with flowtype support

**This project is work in progress**

## Description

Javascript lacks good implementation of reference base models, that you can
reuse in applications. While there exists attempts, to create modelling
libraries, they implement only some aspects of domain driven design and lack
may needed features. This module consits of three components::

- ValueObject
- Model
- Entity


### ValueObject

Value object is encapsulator of arbitary object represented value with
validation support. What this means it can load any json data and checks if
data is correct. It has several features that ValueObjects should have:

- self validation
- immutability
- value getters


**Example ValueObject**

```
// @flow

const ValueObject = require('modeljs').ValueObject;

type User = {
	username: string;
	password: string;
}

class UserValueObject extends ValueObject<User> {
	static get schema() {
		return Joi.object({
			username: Joi.string().alphanum().required(),
			password: Joi.string().min(8).required(),
		});
	}
}

const user1 = new UserValueObject({username: 'test', password: 'password'});
user1.isValid(); // would return true

const user2 = new UserValueObject({username: 'test', password: 'short'});
user2.isValid(); // would return false since password is too short

const user3 = user2.update({password: 'newPassword'}); // update with a new value

user3.get('password') === user2.get('password'); // returns false, since ValueObject is immutable
```

### Entity

Entity is a base model class that can be used for implementing domain
application logic. It is composed of four main components:

- identity: evey entity has to have an identity
- data: **ValueObject** data assocaited with a model
- state: state in which model is
- context: context on which model operates

This separation allows greate flexibility. For example by separating data and
state, these to can be serialized separately. While it's true that data
sometimes present entity state, this is not alloways the case and allows to
manage state separately.

**Example Entity**

```
const Entity = require('modeljs').Entity;

type User = {
	useraname: string;
	password: string;
};

type State = {
	createdAt: Date;
	updatedAt: Date;
};

class UserModel extends Entity<UserModel, User, State>
```

## Installation

```
npm install modeljs
```

### Flowtype support

To make flowtype working in your application, do not forget to add package path
to flowconfig file.

## API

See [API](API.md) reference

## License

MIT

## Author

Jaka Hudoklin <jakahudokli@gmail.com>
