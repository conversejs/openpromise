type OpenPromise<T> = Promise<T> & {
    isResolved: boolean;
    isPending: boolean;
    isRejected: boolean;
    resolve: (value: T | PromiseLike<T>) => void;
    reject: (reason?: any) => void;
    [Symbol.toStringTag]: string;
};

export function getOpenPromise<T>(): OpenPromise<T> {
    const wrapper: Omit<OpenPromise<T>, 'then' | 'catch' | 'finally'> = {
        isResolved: false,
        isPending: true,
        isRejected: false,
        resolve: () => {},
        reject: () => {},
        [Symbol.toStringTag]: 'Promise'
    };

    const promise = new Promise<T>((resolve, reject) => {
        wrapper.resolve = resolve;
        wrapper.reject = reject;
    }) as OpenPromise<T>;

    Object.assign(promise, wrapper);

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
