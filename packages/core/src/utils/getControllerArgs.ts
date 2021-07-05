import { Context } from 'koa';
import get from 'lodash.get';
import { PARAM_TYPES } from '../constants';
import { IParamValue } from '../interface';

const getQuery = (ctx: Context, paramMetadata: IParamValue): any => {
  const { options } = paramMetadata;
  if (options && typeof options === 'string') {
    return get(ctx.query, options);
  }
  return ctx.query;
};

const getBody = (ctx: Context, paramMetadata: IParamValue): any => {
  const { options } = paramMetadata;
  if (options && typeof options === 'string') {
    return get(ctx.request.body, options);
  }
  return ctx.request.body;
};

const getContext = (ctx: Context, paramMetadata: IParamValue): any => {
  return ctx;
};

const getCookies = (ctx: Context, paramMetadata: IParamValue): any => {
  const { options } = paramMetadata;
  if (options && typeof options === 'string') {
    return get(ctx.cookies, options);
  }
  return ctx.cookies;
};

const getSession = (ctx: Context, paramMetadata: IParamValue): any => {
  return ctx.session;
};

export function getControllerArgs(paramMetadataList: IParamValue[], ctx: Context) {
  const args: any[] = [];

  const getValue = (paramMetadata: IParamValue) => {
    switch (paramMetadata.paramType) {
      case PARAM_TYPES.QUERY:
        return getQuery(ctx, paramMetadata);
      case PARAM_TYPES.BODY:
        return getBody(ctx, paramMetadata);
      case PARAM_TYPES.CTX:
        return getContext(ctx, paramMetadata);
      case PARAM_TYPES.COOKIES:
        return getCookies(ctx, paramMetadata);
      case PARAM_TYPES.SESSION:
        return getSession(ctx, paramMetadata);
      default:
        return undefined;
    }
  };

  paramMetadataList.forEach((paramMetadata) => {
    args[paramMetadata.index] = getValue(paramMetadata);
  });
  return args;
}
