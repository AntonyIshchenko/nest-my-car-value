import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable,
} from '@nestjs/common';
import { User } from '../user.entity';
import { UsersService } from '../users.service';

interface Request {
  session?: { userId?: number };
  currentUser?: User;
}

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private userService: UsersService) {}

  async intercept(context: ExecutionContext, handler: CallHandler) {
    const request = context.switchToHttp().getRequest<Request>();
    const { userId } = request.session || {};
    if (userId) {
      const user = await this.userService.findOne(userId);
      if (user) {
        request.currentUser = user;
      }
    }

    return handler.handle();
  }
}
