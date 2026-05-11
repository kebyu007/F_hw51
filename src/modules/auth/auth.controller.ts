import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dtos/sign-up.dto';
import type { Response, Request } from 'express';
import { SignInDto } from './dtos/sign-in.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('/sign-up')
  async signUp(@Body() payload: SignUpDto, @Res() res: Response) {
    return await this.service.register(payload, res);
  }

  @Post('/sign-in')
  async signIn(@Body() payload: SignInDto, @Res() res: Response) {
    return await this.service.login(payload, res);
  }

  @Post('/refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    return await this.service.refresh(req, res);
  }
}
