import {
  CanActivate,
  ConflictException,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { rolesKey } from '../decorators/roles.decorator';
import { protectedKey } from '../decorators/protected.decorator';
import { Request } from 'express';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const isProtected = this.reflector.get<boolean>(
      protectedKey,
      context.getHandler(),
    );

    if (!isProtected) {
      return true;
    }

    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request & { user: any }>();

    const token = request.signedCookies?.['accessToken'];

    if (!token) {
      throw new UnauthorizedException('token not given');
    }

    const decoded = await this.verifyToken(token);

    request.user = decoded;

    return true;
  }

  private async verifyToken(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('jwt.access_key'),
      });

      return payload;
    } catch (error: unknown) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('Token expired');
      }

      if (error instanceof JsonWebTokenError) {
        throw new ConflictException('Token is invalid');
      }

      throw new InternalServerErrorException('Internal Server Error');
    }
  }
}
