import { Protected } from '@/common/decorators/protected.decorator';
import { Controller, Get } from '@nestjs/common';

@Controller('users')
export class UserController {
  @Protected(true)
  @Get()
  async getAll() {
    return ['You have done b``ch'];
  }
}
