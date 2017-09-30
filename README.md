[![Build Status](https://travis-ci.org/offlinehacker/modeljs.png)](https://travis-ci.org/offlinehacker/modeljs)

# ModelJS

[![Greenkeeper badge](https://badges.greenkeeper.io/offlinehacker/modeljs.svg)](https://greenkeeper.io/)

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
application logic. It encapsulates ValueObject and provides change tracking
of model data. User can provide any additional state by extending Entity object.

**Example Entity**

```
const Entity = require('modeljs').Entity;
const ValueObject = require('modeljs').ValueObject;

type User = {
	username?: string;
	password?: string;
};

type ResourceState = {
	id?: string;
	createdAt: Date;
	updatedAt?: Date;
};

class Resource<T, D: Object, S: ResourceState> extends Entity<T, D, S> {
	get InitialState() {
		return {createdAt: new Date()};
	}

	update(data: D) {
		super.update(data);
		this.state.updatedAt = new Date();
	}
}

class UserValueObject extends ValueObject<User> {
	get schema() {
		return Joi.object({
			username: Joi.string().required(),
			password: Joi.string().min(8)
		});
	}

	get updateSchema() {
		return this.schema.keys({
			username: Joi.strip()
		});
	}
}

class CreateUserValueObject extends UserValueObject {
	get schema() {
		return super.schema.requiredKeys(['password']);
	}
}

type UserState = ResourceState & {
	hashedPassword: string;
};

class UserModel extends Resource<UserModel, User, UserState> {
	get ValueObject() {
		if (this.isNew) {
			return CreateUserValueObject;
		}

		return UserValueObject;
	}

	get InitialState() {
		return {createdAt: new Date(), activated: false};
	}
}
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
