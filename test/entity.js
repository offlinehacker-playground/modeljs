// @flow

/* eslint-env node, mocha */

const Joi = require('joi');
const expect = require('chai').expect;

const ValueObject = require('../lib/valueobject');
const Entity = require('../lib/entity');

describe('Entity model', () => {
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

    it('should create a new entity', () => {
        const entity = UserModel.create({
            username: 'user',
            password: 'password'
        });

        expect(entity.value).to.be.instanceof(ValueObject);
        expect(entity.value.get('username')).to.be.equal('user');
        expect(entity.value.get('password')).to.be.equal('password');
        expect(entity.isNew).to.be.true; // eslint-disable-line
        expect(entity.isValid()).to.be.true; // eslint-disable-line
    });

    it('should check entity validity', () => {
        const entity = UserModel.create({
            username: 'user'
        });

        expect(entity.isValid()).to.be.false; // eslint-disable-line

        entity.update({password: 'password'});

        expect(entity.isValid()).to.be.true; // eslint-disable-line
    });

    describe('with loaded entity', () => {
        var model: UserModel; // eslint-disable-line

        before(() => {
            model = UserModel.load({
                username: 'user'
            }, {
                id: '10',
                hashedPassword: 'passwordhash',
                createdAt: new Date()
            });
        });

        it('should load entity', () => {
            expect(model.isNew).to.be.false // eslint-disable-line
            expect(model.state.id).to.be.equal('10');
            expect(model.state.hashedPassword).to.be.equal('passwordhash');
        });

        it('should not update entity with forbidden field', () => {
            model.update({username: 'newuser'});

            expect(model.value.get('username')).to.be.equal('user');
            expect(model.hasChanged('username')).to.be.false; // eslint-disable-line
        });
    });
});
