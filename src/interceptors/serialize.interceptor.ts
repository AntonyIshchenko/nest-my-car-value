import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UseInterceptors,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs';
import { plainToClass } from 'class-transformer';
// import { ClassConstructor } from 'class-transformer';

interface ClassConstructor {
  new (...arg: any[]): {};
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: ClassConstructor) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data: any) => {
        return plainToClass(this.dto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );

    // //Run something before a request is handled by the request handler
    // console.log('Im running before the handler', context);
    // return next.handle().pipe(
    //   map((data: any) => {
    //     // Run something before the response is sent out
    //     console.log('Im running before the response is sent out', data);
    //   }),
    // );
  }
}
