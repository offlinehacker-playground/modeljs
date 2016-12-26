# Entity

Entity class

## id

Entity id

## value

Value associated with entity

## originalValue

Value before any mutation

## state

Entity state

## context

Context assocaited with entity

## isNew

Determines wheter entity is new

Returns **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** 

## update

Updates entity with new data

**Parameters**

-   `data` **D** 

## create

Creates a new Entity

**Parameters**

-   `data` **D** 
-   `context` **\[C](default {}: any)** 

Returns **Any** 

## load

Loads existing entity

**Parameters**

-   `id` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** 
-   `data` **D** 
-   `state` **\[S]**  (optional, default `{}: any`)
-   `context` **\[C](default {}: any)** 

Returns **Any** 

# ValueObject

Value object is a simple object for

## data

data associated with value object

## validate

Validates model data

**Parameters**

-   `data` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

Returns **T** 

## isValid

Checks whether object is valid

Returns **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** 

## update

Updates model data with new data

**Parameters**

-   `data` **T** 

Returns **Any** 

## get

Gets property

**Parameters**

-   `property` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** 

Returns **Any** 
