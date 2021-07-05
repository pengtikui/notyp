import { Service } from 'typedi';
import { PREFIX_METADATA } from '../constants';

export function Controller(prefix?: string): ClassDecorator {
  return (target): void => {
    Service.apply(null)(target);

    Reflect.defineMetadata(PREFIX_METADATA, prefix, target);
  };
}
