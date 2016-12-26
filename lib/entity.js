// @flow

const ValueObject = require('./valueobject');

/**
 * Entity class
 *
 * @class Entity
 * @template T
 * @template D
 * @template Object
 * @template S
 * @template Object
 * @template C
 * @template any
 */
class Entity<T, D: Object, S: Object, C: any> {
    /**
     * Entity id
     *
     * @type {any}
     * @memberOf Entity
     */
    id: ?any;

    /**
     * Value associated with entity
     *
     * @type {ValueObject<D>}
     * @memberOf Entity
     */
    value: ValueObject<D>;

    /**
     * Value before any mutation
     *
     * @type {ValueObject<D>}
     * @memberOf Entity
     */
    originalValue: ValueObject<D>;

    /**
     * Entity state
     *
     * @type {S}
     * @memberOf Entity
     */
    state: S;

    /**
     * Context assocaited with entity
     *
     * @type {C}
     * @memberOf Entity
     */
    context: C;

    constructor(value: ValueObject<D>, state: S, context: C = ({}: any)) {
        this.value = value;
        this.originalValue = value;
        this.context = context;
        this.state = state;
    }

    /**
     * Determines wheter entity is new
     *
     * @type {boolean}
     * @memberOf Entity
     */
    isNew(): boolean {
        return !this.id;
    }

    toJSON(): D {
        return this.value.toJSON();
    }

    static getValueObject(): Class<ValueObject<D>> {
        return ValueObject;
    }

    static getInitialState(): S {
        return ({}: any);
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
     * @param {C} context
     * @returns
     *
     * @memberOf Entity
     */
    static create(data: D, context: C = ({}: any)): T {
        const ValueObject = this.getValueObject();
        const state = this.getInitialState();
        return (new this(new ValueObject(data), state, context): any);
    }

    /**
     * Loads existing entity
     *
     * @static
     * @param {string} id
     * @param {D} data
     * @param {C} context
     * @returns
     *
     * @memberOf Entity
     */
    static load(id: any, data: D, state: S = ({}: any), context: C = ({}: any)): T {
        const ValueObject = this.getValueObject();
        const entity = new this(new ValueObject(data), state, context);

        entity.id = id;

        return (entity: any);
    }
}

module.exports = Entity;
