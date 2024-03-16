import { pbkdf2 } from 'node:crypto';
import { promisify } from 'node:util';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { TokenType } from './constants';
import { SignInDto, SignUpDto } from './dto';
import { TokenData, TokenPayload } from './interfaces';

import { SessionService } from '../session/session.service';
import { GetUserDto } from '../user/dto';
import { UserService } from '../user/user.service';

import { EnvVariables } from '../../common/constants';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private sessionService: SessionService,
    private jwtService: JwtService,
    private config: ConfigService
  ) {}

  public async signUp(dto: SignUpDto): Promise<GetUserDto> {
    const payload = {
      ...dto,
      password: await this.hashPassword(dto.password),
    };

    const user = await this.userService.createUser(payload);
    return user;
  }

  public async signIn(clientId: string, dto: SignInDto): Promise<TokenData> {
    const user = await this.userService.getUserByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Credentials incorrect');
    }

    const passwordHash = await this.hashPassword(dto.password);
    if (passwordHash !== user.password) {
      throw new UnauthorizedException('Credentials incorrect');
    }

    const tokens = {
      access: await this.signTokens({ sub: user.id }, TokenType.ACCESS),
      refresh: await this.signTokens({ sub: user.id }, TokenType.REFRESH),
    };

    const sessionPayload = {
      userId: user.id,
      clientId,
      refreshToken: tokens.refresh,
    };
    await this.sessionService.createOrUpdate(sessionPayload);

    return tokens;
  }

  public signOut(clientId: string, userId: string) {
    return this.sessionService.delete(userId, clientId);
  }

  public async updateTokens(clientId: string, refreshToken: string) {
    let payload: TokenPayload;
    try {
      payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.config.get(EnvVariables.REFRESH_TOKEN_SECRET),
      });
    } catch (error) {
      throw new UnauthorizedException('Refresh token invalid');
    }

    const session = await this.sessionService.get(payload.sub, clientId);
    if (!session) {
      throw new UnauthorizedException('Refresh token invalid');
    }
    if (session.refreshToken !== refreshToken) {
      throw new UnauthorizedException('Refresh token invalid');
    }

    const tokens = {
      access: await this.signTokens({ sub: payload.sub }, TokenType.ACCESS),
      refresh: await this.signTokens({ sub: payload.sub }, TokenType.REFRESH),
    };

    const updatePayload = {
      userId: payload.sub,
      clientId,
      refreshToken: tokens.refresh,
    };
    await this.sessionService.createOrUpdate(updatePayload);

    return tokens;
  }

  private hashPassword(password: string): Promise<string> {
    return promisify(pbkdf2)(password, this.config.get(EnvVariables.PASSWORD_SALT), 1000, 64, 'sha512').then(hash =>
      hash.toString('hex')
    );
  }

  private signTokens(tokenPayload: TokenPayload, tokenType: TokenType): Promise<string> {
    const options = {
      [TokenType.ACCESS]: { secret: this.config.get(EnvVariables.ACCESS_TOKEN_SECRET), expiresIn: '24h' },
      [TokenType.REFRESH]: { secret: this.config.get(EnvVariables.REFRESH_TOKEN_SECRET), expiresIn: '30d' },
    };

    return this.jwtService.signAsync(tokenPayload, options[tokenType]);
  }
}
