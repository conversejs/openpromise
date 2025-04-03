type OpenPromise<T> = Promise<T> & {
    isResolved: boolean;
    isPending: boolean;
    isRejected: boolean;
    resolve: (value: T | PromiseLike<T>) => void;
    reject: (reason?: any) => void;
};

export function getOpenPromise<T>(): OpenPromise<T> {
    const wrapper = {
        isResolved: false,
        isPending: true,
        isRejected: false
    };

    let promise: OpenPromise<T>;
    let resolve: (value: T | PromiseLike<T>) => void = () => {};
    let reject: (reason?: any) => void = () => {};

    if (typeof Promise.withResolvers === 'function') {
        const { promise: p, resolve: r, reject: j } = Promise.withResolvers<T>();
        promise = p as OpenPromise<T>;
        resolve = r;
        reject = j;
    } else {
        promise = new Promise<T>((r, j) => {
            resolve = r;
            reject = j;
        }) as OpenPromise<T>;
    }

    Object.assign(promise, {
        ...wrapper,
        resolve,
        reject
    });

    promise.then(
        (v: T) => {
            promise.isResolved = true;
            promise.isPending = false;
            promise.isRejected = false;
            return v;
        },
        (e: any) => {
            promise.isResolved = false;
            promise.isPending = false;
            promise.isRejected = true;
            throw e;
        }
    );

    return promise;
}
