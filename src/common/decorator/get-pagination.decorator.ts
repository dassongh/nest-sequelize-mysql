import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const GetPagination = createParamDecorator((data: string | undefined, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return {
    page: request.query.page ? Number(request.query.page) : 1,
    limit: request.query.limit ? Number(request.query.limit) : 10,
  };
});
