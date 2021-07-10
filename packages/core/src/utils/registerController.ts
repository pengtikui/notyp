import Container from 'typedi';
import Koa from 'koa';
import Router from '@koa/router';
import isPromise from 'is-promise';
import { joinPath } from './joinPath';
import { METHOD_METADATA, PARAM_TYPES, PATH_METADATA, PREFIX_METADATA } from '../constants';
import { IParamValue } from '../interface';
import { getControllerArgs } from './getControllerArgs';

const getMethodNames = (prototype: any): string[] => {
  return Object.getOwnPropertyNames(prototype).filter((methodName: string) => {
    if (methodName === 'constructor') {
      return false;
    }
    const fn = prototype[methodName];
    const method = Reflect.getMetadata(METHOD_METADATA, fn);
    if (!method || typeof fn !== 'function') {
      return false;
    }
    return true;
  });
};

const makeRouterMiddleware =
  (fn: Function, instance: Object, paramMetadataList: IParamValue[], paramTypes: any[]) =>
  async (ctx: Koa.Context, next: Koa.Next) => {
    const args = await getControllerArgs(ctx, paramMetadataList, paramTypes);

    let result = fn.apply(instance, args);
    ctx.body = isPromise(result) ? await result : result;
  };

export function registerController(controllers: Function[], app: Koa) {
  const router = new Router();

  controllers.forEach((ControllerClass) => {
    const prefix = Reflect.getMetadata(PREFIX_METADATA, ControllerClass);

    const instance = Container.get<Object>(ControllerClass);
    const prototype = Object.getPrototypeOf(instance);

    const methodNames = getMethodNames(prototype);

    methodNames.forEach((methodName) => {
      const fn = prototype[methodName];

      const path = Reflect.getMetadata(PATH_METADATA, fn);
      const method = Reflect.getMetadata(METHOD_METADATA, fn);

      const fullPath = joinPath(prefix, path);

      const paramMetadataList: IParamValue[] = [];
      Object.values(PARAM_TYPES).forEach((paramType) => {
        const metadata = Reflect.getMetadata(paramType, instance, methodName);
        paramMetadataList.push(...(metadata || []));
      });

      const paramTypes = Reflect.getMetadata('design:paramtypes', instance, methodName);

      (router as any)[method](
        fullPath,
        makeRouterMiddleware(fn, instance, paramMetadataList, paramTypes)
      );
    });
  });

  app.use(router.routes());
  (app as any).router = router;
}
