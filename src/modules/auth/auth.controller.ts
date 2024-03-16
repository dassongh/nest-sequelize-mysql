import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { GetIP, GetUserId } from './decorator';
import { SignInDto, SignUpDto, TokenDataDto, UpdateTokensDto } from './dto';
import { AuthGuard } from './guard';

import { StatusOkDto } from '../../common/dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Sign Up' })
  @ApiResponse({ status: 200, type: SignUpDto })
  @Post('sign-up')
  public async signUp(@Body() dto: SignUpDto) {
    const user = await this.authService.signUp(dto);
    return { data: user };
  }

  @ApiOperation({ summary: 'Sign In' })
  @ApiResponse({ status: 200, type: TokenDataDto })
  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  public async signIn(@GetIP() ip: string, @Body() dto: SignInDto) {
    const tokens = await this.authService.signIn(ip, dto);
    return { data: tokens };
  }

  @ApiOperation({ summary: 'Sign Out' })
  @ApiResponse({ status: 200, type: StatusOkDto })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('sign-out')
  public async signOut(@GetIP() ip: string, @GetUserId() userId: string) {
    await this.authService.signOut(ip, userId);
    return { status: 'ok' };
  }

  @ApiOperation({ summary: 'Update tokens' })
  @ApiResponse({ status: 200, type: TokenDataDto })
  @HttpCode(HttpStatus.OK)
  @Post('update-tokens')
  public async updateTokens(@GetIP() ip: string, @Body() dto: UpdateTokensDto) {
    const tokens = await this.authService.updateTokens(ip, dto.refreshToken);
    return { data: tokens };
  }
}
