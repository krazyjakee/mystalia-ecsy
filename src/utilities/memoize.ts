const cache = {};

export default function memoize<F extends (...args: any[]) => any>(func: F): F {
  // @ts-ignore
  return function() {
    const args = Array.prototype.slice.call(arguments);
    const argsHash = JSON.stringify(args.slice(0, arguments.length - 2));

    if (cache[argsHash]) {
      return cache[argsHash];
    } else {
      func(arguments);
    }
  };
}
