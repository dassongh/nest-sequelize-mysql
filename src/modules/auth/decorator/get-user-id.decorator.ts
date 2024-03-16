import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const GetUserId = createParamDecorator((_data: undefined, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user.sub;
});
