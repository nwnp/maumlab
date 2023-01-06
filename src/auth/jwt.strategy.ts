import { GraphQLError } from 'graphql';
import { UsersService } from '../users/users.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { User } from 'src/common/database/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersDao: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'secretkey',
    });
  }

  async validate(payload): Promise<User | Error> {
    const user = await this.usersDao.getUserById(payload.id);
    if (!user) return new GraphQLError('유효하지 않은 회원');
    return user;
  }
}
