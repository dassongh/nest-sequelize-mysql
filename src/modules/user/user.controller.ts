import { Controller, Get, Param, UseGuards } from '@nestjs/common';

import { UserService } from './user.service';

import { GetUserId } from '../auth/decorator';
import { AuthGuard } from '../auth/guard';

@UseGuards(AuthGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  public async getMe(@GetUserId() userId: string) {
    const user = await this.userService.getUserById(userId);
    return { data: user };
  }

  @Get(':id')
  public async getUser(@Param('id') userId: string) {
    const user = await this.userService.findUserById(userId);
    return { data: user };
  }
}
