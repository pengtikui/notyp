import Koa, { Middleware } from 'koa';

export function registerMiddleware(middlewares: Middleware[], app: Koa) {
  middlewares.forEach((middleware) => {
    app.use(middleware);
  });
}
