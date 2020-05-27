import { makeHash } from "./hash";
import { clone } from "./guards";

const cache = {};

export default function memoize<F extends (...args: any[]) => any>(func: F): F {
  // @ts-ignore
  return function() {
    const args = Array.prototype.slice.call(arguments);
    const argsHash = makeHash(
      func.toString() + JSON.stringify(args.slice(0, args.length))
    );

    if (cache[argsHash]) {
      return clone(cache[argsHash]);
    }

    const result = func(...arguments);
    cache[argsHash] = clone(result);
    return result;
  };
}
