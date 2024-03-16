import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service';
import { GetIP, GetUserId } from './decorator';
import { SignInDto, SignUpDto, UpdateTokensDto } from './dto';
import { AuthGuard } from './guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-up')
  public async signUp(@Body() dto: SignUpDto) {
    const user = await this.authService.signUp(dto);
    return { data: user };
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  public async signIn(@GetIP() ip: string, @Body() dto: SignInDto) {
    const tokens = await this.authService.signIn(ip, dto);
    return { data: tokens };
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('sign-out')
  public async signOut(@GetIP() ip: string, @GetUserId() userId: string) {
    await this.authService.signOut(ip, userId);
    return { status: 'ok' };
  }

  @HttpCode(HttpStatus.OK)
  @Post('update-tokens')
  public async updateTokens(@GetIP() ip: string, @Body() dto: UpdateTokensDto) {
    const tokens = await this.authService.updateTokens(ip, dto.refreshToken);
    return { data: tokens };
  }
}
