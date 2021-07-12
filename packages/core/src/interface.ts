import { Context, Next } from 'koa';

export interface IParamValue {
  paramType: string;
  methodName: string;
  index: number;
  options?: any;
}

export interface NotypMiddleware {
  use(ctx: Context, next: Next): void;
}

export type Middleware = any | Function;
