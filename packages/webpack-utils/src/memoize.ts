export function memoize<T extends (...args: Array<any>) => any>(fn: T): T {
    let value: any;
    return ((...fnArgs: Array<any>): any => value = value ?? fn(...fnArgs)) as T;
}
