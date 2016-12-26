// @flow

/* eslint-env node, mocha */

const Joi = require('joi');
const expect = require('chai').expect;

const ValueObject = require('../lib/valueobject');
const Entity = require('../lib/entity');

describe('entity', () => {
    type TestValueType = {
        property: string
    };

    type TestState = {
        isAlive: boolean;
    };

    class TestValueObject extends ValueObject<TestValueType> {
        static get schema() {
            return Joi.object({
                property: Joi.required()
            });
        }
    }

    class TestEntity extends Entity<TestEntity, TestValueType, TestState, Object> {
        static getValueObject() {
            return TestValueObject;
        }

        static getInitialState() {
            return {isAlive: false};
        }

        isValid() {
            return super.isValid() && this.state.isAlive;
        }

        makeAlive() {
            this.state.isAlive = true;
        }
    }

    it('should create a new entity', () => {
        const entity = TestEntity.create({
            property: 'value'
        });

        expect(entity.value).to.be.instanceof(ValueObject);
        expect(entity.isNew()).to.be.true; // eslint-disable-line
    });

    it('should check entity validity', () => {
        const entity = TestEntity.create({
            property: 'value'
        });

        expect(entity.isValid()).to.be.false; // eslint-disable-line

        entity.makeAlive();

        expect(entity.isValid()).to.be.true; // eslint-disable-line
    });

    it('should load entity', () => {
        const entity = TestEntity.load(11, {property: 'test'}, {isAlive: true}, {});

        expect(entity.id).to.be.equal(11);
        expect(entity.isNew()).to.be.false // eslint-disable-line
        expect(entity.state.isAlive).to.be.true; // eslint-disable-line
        expect(entity.value.get('property')).to.be.equal('test');
    });

    it('should update entity', () => {
        const entity = TestEntity.load(11, {property: 'test'}, {isAlive: true}, {});
        entity.update({property: 'someothervalue'});

        expect(entity.value.get('property')).to.be.equal('someothervalue');
        expect(entity.hasChanged('property')).to.be.true; // eslint-disable-line
    });
});
