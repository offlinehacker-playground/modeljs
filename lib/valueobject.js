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

    constructor(data: D) {
        this.data = this.validate(Immutable.fromJS(data));
    }

    // static variant of model schema
    static get schema() {
        return Joi.object({});
    }

    // dynamic model schema
    get schema(): any {
        return this.constructor.schema;
    }

    /**
     * Validates model data
     *
     * @param {Object} data
     * @returns {T}
     *
     * @memberOf Model
     */
    validate(data: Object): D {
        const result = Joi.validate(data.toJS(), this.schema, {
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

        return this.clone((updatedData: any));
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

    clone(data?: D): ValueObject<D> {
        return new this.constructor((data || this.data: any));
    }
}

module.exports = ValueObject;
