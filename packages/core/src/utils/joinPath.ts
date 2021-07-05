const startWith = (char: string, target: string): boolean => {
  return target[0] === char;
};

const endWith = (char: string, target: string): boolean => {
  return target[target.length - 1] === char;
};

export function joinPath(...args: string[]): string {
  return args
    .map((arg) => {
      if (!startWith('/', arg)) {
        arg = '/' + arg;
      }
      if (endWith('/', arg)) {
        arg = arg.slice(0, -1);
      }
      return arg;
    })
    .reduce((acc, cur) => (acc += cur), '');
}
