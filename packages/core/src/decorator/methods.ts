import { METHOD_METADATA, PATH_METADATA } from '../constants';

// prettier-ignore
const createMethodDecorator = (method: string) => (path: string): MethodDecorator => {
  return (target, key, descriptor: TypedPropertyDescriptor<any>) => {
    Reflect.defineMetadata(PATH_METADATA, path, descriptor.value);
    Reflect.defineMetadata(METHOD_METADATA, method, descriptor.value);
  };
};

export const Get = createMethodDecorator('get');

export const Post = createMethodDecorator('post');

export const Put = createMethodDecorator('put');

export const Patch = createMethodDecorator('patch');

export const Delete = createMethodDecorator('delete');

export const Head = createMethodDecorator('head');

export const Options = createMethodDecorator('options');
