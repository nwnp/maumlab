import { UsersService } from './../../users/users.service';
import { GraphQLError } from 'graphql';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserLoginModel } from 'src/users/models/login.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(userInfo: UserLoginModel): Promise<object> {
    const user = await this.usersService.getUserByEmail(userInfo.email);
    if (!user) throw new GraphQLError('존재하지 않는 회원');
    const compared: boolean = await bcrypt.compare(
      userInfo.password,
      user.password,
    );

    if (!compared) throw new GraphQLError('유효하지 않은 비밀번호');

    const accessToken = this.jwtService.sign(
      { id: user.id },
      {
        secret: process.env.SECRET_KEY,
        expiresIn: '7200s',
      },
    );
    return { accessToken };
  }
}
