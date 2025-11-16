import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

interface ErrorResponse {
  statusCode: number;
  message: string | string[];
  error?: string;
  timestamp: string;
  path: string;
}

@Catch()
export class ExceptionInterceptor implements ExceptionFilter {
  private readonly logger = new Logger(ExceptionInterceptor.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>;

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';
    let error: string | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseObject = exceptionResponse as any;

        message = responseObject.message || exception.message;
        error = responseObject.error || this.getErrorType(status);

        if (Array.isArray(message)) {
          message = message;
        }
      } else {
        message = exceptionResponse as string;
        error = this.getErrorType(status);
      }

      this.logger.warn(
        `HTTP Exception: ${status} - ${JSON.stringify(message)} - Path: ${(request as any).url}`,
      );
    } else if (exception instanceof Error) {
      message = exception.message;
      error = 'Internal Server Error';

      this.logger.error(
        `Unexpected Error: ${exception.message} - Stack: ${exception.stack} - Path: ${(request as any).url}`,
      );
    } else {
      message = 'An unexpected error occurred';
      error = 'Unknown Error';

      this.logger.error(
        `Unknown Error Type: ${JSON.stringify(exception)} - Path: ${(request as any).url}`,
      );
    }

    const errorResponse: ErrorResponse = {
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: (request as any).url,
    };

    if (error) {
      errorResponse.error = error;
    }

    response.status(status).json(errorResponse);
  }

  /**
   * Retorna o tipo de erro baseado no status HTTP
   */
  private getErrorType(status: number): string {
    const errorMap: Record<number, string> = {
      [HttpStatus.BAD_REQUEST]: 'Bad Request',
      [HttpStatus.UNAUTHORIZED]: 'Unauthorized',
      [HttpStatus.FORBIDDEN]: 'Forbidden',
      [HttpStatus.NOT_FOUND]: 'Not Found',
      [HttpStatus.CONFLICT]: 'Conflict',
      [HttpStatus.UNPROCESSABLE_ENTITY]: 'Unprocessable Entity',
      [HttpStatus.INTERNAL_SERVER_ERROR]: 'Internal Server Error',
      [HttpStatus.SERVICE_UNAVAILABLE]: 'Service Unavailable',
    };

    return errorMap[status] || 'Unknown Error';
  }
}
