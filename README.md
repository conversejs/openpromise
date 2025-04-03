# openpromise

JavaScript promises require that you call `reject` or `resolve` inside the closure of the created promise.

For example:
```

    const promise = new Promise((resolve, reject) => {
        // We have to call resolve or reject here, inside the closure
    });

    // We can't resolve the promise here, outside of the closure
```

This package lets you create an *open promise*. This is a normal JavaScript
Promise, but with its `resolve` and `reject` callbacks set as attributes on the promise itself.

This lets you resolve or reject the promise outside of its closure.

For example:

```
    import { getOpenPromise } from 'openpromise';

    const promise = getOpenPromise();
    const func = setTimeout(() => promise.resolve(), 1000);
    return promise;
```

## Promise.withResolvers

This package predates the newer built-in [Promise.withResolvers](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/withResolvers) static method.
However, it's been updated to make use of `Promise.withResolvers` in case it's available.

