import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype, data, type }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const isWholeBody = type === 'body' && data === undefined;

    if (isWholeBody && value == null) {
      throw new BadRequestException('Request body is required');
    }

    const object = plainToInstance(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      var firstError = errors[0];
      var constraints = firstError?.constraints;
      if (constraints) {
        const firstErrorMessage = constraints[Object.keys(constraints)[0]];
        throw new BadRequestException({
          success: false,
          message: firstErrorMessage,
        });
      }
    }
    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}