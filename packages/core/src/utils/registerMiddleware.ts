import Koa, { Middleware as KoaMiddleware } from 'koa';
import Container from 'typedi';
import isClass from 'is-class';
import isFunction from 'is-function';
import { Middleware } from '../interface';

export function registerMiddleware(middlewares: Middleware[], app: Koa) {
  middlewares.forEach((middleware) => {
    if (isClass(middleware) && typeof middleware.prototype.use === 'function') {
      const instance = Container.get(middleware);
      app.use(instance.use.bind(instance));
    } else if (!isClass(middleware) && isFunction(middleware)) {
      app.use(middleware as KoaMiddleware);
    } else {
      throw new Error('Middleware must be a plain function or implement NotypMiddleware.');
    }
  });
}
