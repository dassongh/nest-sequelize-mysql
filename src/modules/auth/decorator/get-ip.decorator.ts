import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const GetIP = createParamDecorator((_data: undefined, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.headers['x-forwarded-for'] || request.headers['x-real-ip'] || request.ip;
});
