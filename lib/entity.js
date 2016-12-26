// @flow

const ValueObject = require('./valueobject');

/**
 * Entity class
 *
 * @class Entity
 * @template T
 * @template D
 */
class Entity<T, D: Object, S: Object> {
    /**
     * Value associated with entity
     *
     * @type {ValueObject<D>}
     * @memberOf Entity
     */
    value: ValueObject<D>;

    /**
     * State associated with entity
     *
     * @type {S}
     * @memberOf Entity
     */
    state: S;

    /**
     * Value before any mutation
     *
     * @type {ValueObject<D>}
     * @memberOf Entity
     */
    originalValue: ValueObject<D>;

    error: Error;

    isNew: boolean;

    toJSON(): D {
        return this.value.toJSON();
    }

    get InitalState(): S {
        return ({}: any);
    }

    get ValueObject(): Class<ValueObject<D>> {
        return ValueObject;
    }

    /**
     * Updates entity with new data
     *
     * @param {D} data
     *
     * @memberOf Entity
     */
    update(data: D) {
        this.value = (this.value.update(data): any);
    }

    isValid() {
        return this.value.isValid();
    }

    hasChanged(property: string | Array<string | number>) {
        const val1 = this.value.get(property);

        if (val1 instanceof Object) {
            return val1.equals(this.originalValue.get(property));
        }

        return val1 !== this.originalValue.get(property);
    }

    /**
     * Creates a new Entity
     *
     * @static
     * @param {D} data
     * @returns Entity<T, D, S>
     *
     * @memberOf Entity
     */
    static create(data: D, ...args): T { // eslint-disable-line no-unused-vars
        const entity = new this();
        entity.isNew = true;
        entity.state = entity.InitalState;
        entity.value = entity.ValueObject.create(data);
        entity.originalValue = entity.value;

        return (entity: any);
    }

    /**
     * Loads existing entity
     *
     * @static
     * @param {D} data
     * @param {S} state
     * @returns Entity<T, D, S>
     *
     * @memberOf Entity
     */
    static load(data: D, state: S, ...args): T { // eslint-disable-line no-unused-vars
        const entity = new this();
        entity.isNew = false;
        entity.state = state;
        entity.value = entity.ValueObject.create(data);
        entity.originalValue = entity.value;

        return (entity: any);
    }
}

module.exports = Entity;
