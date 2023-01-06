import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddle implements NestMiddleware {
  private logger = new Logger('Logger Middleware');
  use(req: Request, res: Response, next: NextFunction) {
    res.on('finish', () => {
      this.logger.log(
        `${req.ip}, ${req.originalUrl}, ${req.method}, ${res.statusCode}`,
      );
    });
    next();
  }
}
