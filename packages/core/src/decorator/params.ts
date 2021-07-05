import { PARAM_TYPES } from '../constants';
import { IParamValue } from '../interface';

const createParamDecorator =
  (paramType: string) =>
  (options?: any): ParameterDecorator => {
    return (target: Object, key: string | symbol, index: number) => {
      const metadata: IParamValue[] = Reflect.getOwnMetadata(paramType, target, key) || [];
      metadata.push({
        paramType,
        methodName: key as string,
        index,
        options,
      });
      Reflect.defineMetadata(paramType, metadata, target, key);
    };
  };

export const Query = createParamDecorator(PARAM_TYPES.QUERY);
export const Body = createParamDecorator(PARAM_TYPES.BODY);
export const Ctx = createParamDecorator(PARAM_TYPES.CTX);
export const Cookie = createParamDecorator(PARAM_TYPES.COOKIES);
export const Session = createParamDecorator(PARAM_TYPES.SESSION);
