// @flow

/* eslint-env node, mocha */

const Joi = require('joi');
const expect = require('chai').expect;

const ValueObject = require('../lib/valueobject');

describe('valueobject', () => {
    type TestValueType = {
        property1: string;
    };

    class TestValueObject extends ValueObject<TestValueType> {
        static get schema() {
            return Joi.object({
                property1: Joi.string().max(5).required()
            });
        }
    }

    it('should create a simple value object class', () => {
        const testValue = new TestValueObject({
            property1: 'value'
        });

        expect(testValue.data.get('property1')).to.be.equal('value');
    });

    it('it should update', () => {
        const testValue1 = new TestValueObject({
            property1: 'value'
        });

        const testValue2 = testValue1.update({property1: 'newvalue'});

        expect(testValue2.data.get('property1')).to.be.equal('newvalue');
        expect(testValue1).to.not.be.equal(testValue2);
    });

    it('should not be valid if wrong data', () => {
        let testValue = new TestValueObject({
            property1: Joi.string().max(5).required()
        });

        expect(testValue.isValid()).to.be.false; // eslint-disable-line
        expect(testValue.error).to.not.be.equal(undefined); // eslint-disable-line

        testValue = testValue.update({property1: 'ok'});

        expect(testValue.isValid()).to.be.true; // eslint-disable-line
        expect(testValue.error).to.not.be.equal(undefined); // eslint-disable-line
    });

    it('should get value json representation', () => {
        const jsValue = {property1: 'value'};
        const testValue = new TestValueObject(jsValue);

        expect(testValue.toJSON()).to.be.deep.equal(jsValue);
    });
});
