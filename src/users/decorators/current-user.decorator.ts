import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/users/user.entity';

interface Request {
  session?: { userId?: number };
  currentUser?: User;
}

export const CurrentUser = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<Request>();

    console.log('hi from custom decorator');

    return request.currentUser;
  },
);
