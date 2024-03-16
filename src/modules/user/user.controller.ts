import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { GetUserDto } from './dto';
import { UserService } from './user.service';

import { GetUserId } from '../auth/decorator';
import { AuthGuard } from '../auth/guard';

@ApiBearerAuth()
@ApiTags('users')
@UseGuards(AuthGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user' })
  @ApiResponse({ status: 200, type: GetUserDto })
  public async getMe(@GetUserId() userId: string) {
    const user = await this.userService.getUserById(userId);
    return { data: user };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiResponse({ status: 200, type: GetUserDto })
  public async getUser(@Param('id') userId: string) {
    const user = await this.userService.findUserById(userId);
    return { data: user };
  }
}
