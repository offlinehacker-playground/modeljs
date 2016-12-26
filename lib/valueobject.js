// @flow

const Joi = require('joi');
const _ = require('lodash');
const Immutable = require('immutable');

/**
 * Value object is a simple object for
 *
 * @class ValueObject
 * @template D
 * @template Object
 * @template C
 */
class ValueObject<D: Object> {
    /**
     * data associated with value object
     *
     * @type {D}
     * @memberOf ValueObject
     */
    data: Immutable.Map<string, D>;

    error: Error;

    // dynamic model schema
    get schema(): any {
        return Joi.object({});
    }

    get updateSchema(): any {
        return this.schema;
    }

    /**
     * Validates model data
     *
     * @param {Object} data
     * @returns {T}
     *
     * @memberOf Model
     */
    validate(data: Object, schema: Object): D {
        const result = Joi.validate(data.toJS(), schema, {
            stripUnknown: true
        });

        this.error = result.error;

        return (Immutable.fromJS(result.value): D);
    }

    /**
     * Checks whether object is valid
     *
     * @returns {boolean}
     *
     * @memberOf ValueObject
     */
    isValid(): boolean {
        return !this.error;
    }

    /**
     * Updates model data with new data
     *
     * @param {T} data
     * @returns
     *
     * @memberOf Model
     */
    update(data: D): ValueObject<D> {
        const updatedData = this.data.mergeDeep(data);
        const valueObject = new this.constructor();
        valueObject.data = this.data.mergeDeep(valueObject.validate(updatedData, this.updateSchema));

        return valueObject;
    }

    /**
     * Gets property
     *
     * @param {string} property
     *
     * @memberOf ValueObject
     */
    get(property: string | Array<string | number>): any {
        if (_.isString(property)) {
            property = [(property: any)];
        }
        return this.data.getIn(property);
    }

    toJSON(): D {
        return this.data.toJS();
    }

    static create(data: D): ValueObject<D> {
        const valueObject = new this();
        valueObject.data = valueObject.validate(Immutable.fromJS(data), valueObject.schema);

        return valueObject;
    }
}

module.exports = ValueObject;
