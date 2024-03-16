import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { CreateUserDto, GetUserDto } from './dto';
import { User } from './user.entity';

import { Repositories } from '../../common/constants';

@Injectable()
export class UserService {
  constructor(@Inject(Repositories.USER) private userRepository: typeof User) {}

  public async findUserById(id: string): Promise<GetUserDto> {
    const user = await this.getUserById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  public getUserById(id: string): Promise<GetUserDto> {
    return this.userRepository.findOne({ where: { id }, attributes: ['id', 'name', 'email'], raw: true });
  }

  public getUserByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email }, raw: true });
  }

  public async createUser(dto: CreateUserDto): Promise<GetUserDto> {
    const user = await this.userRepository.create({ ...dto });
    return new GetUserDto(user);
  }
}
