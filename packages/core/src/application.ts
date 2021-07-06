import { Server } from 'http';
import { ListenOptions } from 'net';
import Koa, { Middleware } from 'koa';
import Router from '@koa/router';

import bodyParser from 'koa-bodyparser';
import session from 'koa-session';

import { registerController } from './utils/registerController';
import { registerMiddleware } from './utils/registerMiddleware';

export interface ApplicationOptions {
  /**
   * Signed cookie keys
   */
  keys?: string[];

  /**
   * Trust proxy headers
   */
  proxy?: boolean;

  /**
   * Subdomain offset
   */
  subdomainOffset?: number;

  /**
   * Controller list
   */
  controllers?: Function[];

  /**
   * Middleware list
   */
  middlewares?: Middleware[];

  /**
   * Body parser options
   * @link https://github.com/koajs/bodyparser
   */
  bodyParser?: bodyParser.Options;

  /**
   * Session options
   * @link https://github.com/koajs/session
   */
  session?: session.opts;
}

export class Application extends Koa {
  private server: Server | null = null;
  private router: Router | null = null;

  private presetMiddlewares: Middleware[] = [];

  private controllers: Function[] = [];
  private middlewares: Middleware[] = [];

  constructor(options?: ApplicationOptions) {
    super({
      keys: options?.keys,
      proxy: options?.proxy,
      subdomainOffset: options?.subdomainOffset,
    });

    this.controllers = options?.controllers || [];
    this.middlewares = options?.middlewares || [];

    this.presetMiddlewares.push(bodyParser(options?.bodyParser));
    this.presetMiddlewares.push(session(options?.session || {}, this));
  }

  // prettier-ignore
  bootstrap(port?: number, hostname?: string, backlog?: number, listeningListener?: () => void): void;
  bootstrap(port: number, hostname?: string, listeningListener?: () => void): void;
  bootstrap(port: number, backlog?: number, listeningListener?: () => void): void;
  bootstrap(port: number, listeningListener?: () => void): void;
  bootstrap(path: string, backlog?: number, listeningListener?: () => void): void;
  bootstrap(path: string, listeningListener?: () => void): void;
  bootstrap(options: ListenOptions, listeningListener?: () => void): void;
  bootstrap(handle: any, backlog?: number, listeningListener?: () => void): void;
  bootstrap(handle: any, listeningListener?: () => void): void;
  public bootstrap(...args: any): void {
    registerMiddleware([...this.presetMiddlewares, ...this.middlewares], this);
    registerController(this.controllers, this);

    this.server = this.listen(...args);
  }
}