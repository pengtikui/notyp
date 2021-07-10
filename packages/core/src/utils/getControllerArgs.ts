import { Context } from 'koa';
import get from 'lodash.get';
import { plainToClass } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { PARAM_TYPES } from '../constants';
import { IParamValue } from '../interface';
import { ValidationException } from '../exception/ValidationException';

const tranformAndValidateValue = async (type: any, plain: any, options?: any): Promise<any> => {
  const value = plainToClass(type, plain);

  try {
    await validateOrReject(value);
  } catch (error) {
    throw new ValidationException(error);
  }

  if (options && typeof options === 'string') {
    return get(value, options);
  }
  return value;
};

const getQuery = (ctx: Context, paramMetadata: IParamValue, paramTypes: any[]): any => {
  const { options, index } = paramMetadata;
  return tranformAndValidateValue(paramTypes[index], ctx.query, options);
};

const getBody = (ctx: Context, paramMetadata: IParamValue, paramTypes: any[]): any => {
  const { options, index } = paramMetadata;
  return tranformAndValidateValue(paramTypes[index], ctx.request.body, options);
};

const getContext = (ctx: Context): any => {
  return ctx;
};

const getCookies = (ctx: Context, paramMetadata: IParamValue): any => {
  const { options } = paramMetadata;
  if (options && typeof options === 'string') {
    return get(ctx.cookies, options);
  }
  return ctx.cookies;
};

const getSession = (ctx: Context): any => {
  return ctx.session;
};

const getParams = (ctx: Context, paramMetadata: IParamValue): any => {
  const { options } = paramMetadata;
  if (options && typeof options === 'string') {
    return get(ctx.params, options);
  }
  return ctx.params;
};

export async function getControllerArgs(
  ctx: Context,
  paramMetadataList: IParamValue[],
  paramTypes: any[]
) {
  const args: any[] = [];

  const getValue = async (paramMetadata: IParamValue) => {
    switch (paramMetadata.paramType) {
      case PARAM_TYPES.QUERY:
        return getQuery(ctx, paramMetadata, paramTypes);
      case PARAM_TYPES.BODY:
        return getBody(ctx, paramMetadata, paramTypes);
      case PARAM_TYPES.CTX:
        return getContext(ctx);
      case PARAM_TYPES.COOKIES:
        return getCookies(ctx, paramMetadata);
      case PARAM_TYPES.SESSION:
        return getSession(ctx);
      case PARAM_TYPES.PARAMS:
        return getParams(ctx, paramMetadata);
      default:
        return undefined;
    }
  };

  for (const paramMetadata of paramMetadataList) {
    args[paramMetadata.index] = await getValue(paramMetadata);
  }

  return args;
}
