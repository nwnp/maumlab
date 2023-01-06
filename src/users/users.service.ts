import { UserEditModel } from './models/edit.model';
import { Injectable, Logger } from '@nestjs/common';
import { UserSignupModel } from './models/signup.model';
import { DataSource, Repository } from 'typeorm';
import { User } from 'src/common/database/user.entity';
import { GraphQLError } from 'graphql';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  private readonly logger = new Logger('USER');
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private dataSource: DataSource,
  ) {}

  async getUserById(userId: number): Promise<User> {
    try {
      const user = await this.usersRepository.findOne({
        where: { id: userId },
      });
      return user;
    } catch (error) {
      console.error(error);
      throw new GraphQLError('ID로 유저 찾기 DAO ERROR');
    }
  }

  async getUserByEmail(email: string): Promise<User> {
    try {
      const isExistUser = await this.dataSource
        .getRepository(User)
        .createQueryBuilder('user')
        .where('user.email = :email', { email })
        .getOne();
      return isExistUser;
    } catch (error) {
      console.error(error);
      this.logger.error('이메일로 유저 찾기 DAO ERROR');
    }
  }

  async getUserByNickname(nickname: string): Promise<User> {
    try {
      const isExistUser = await this.dataSource
        .getRepository(User)
        .createQueryBuilder('user')
        .where('user.nickname = :nickname', { nickname })
        .getOne();
      return isExistUser;
    } catch (error) {
      console.error(error);
      this.logger.error('닉네임으로 유저 찾기 DAO ERROR');
    }
  }

  async existCheck(user: UserSignupModel | UserEditModel) {
    const isExistEmail = await this.getUserByEmail(user.email);
    if (isExistEmail) throw new GraphQLError('이미 존재하는 이메일');

    const isExistNickname = await this.getUserByNickname(user.nickname);
    if (isExistNickname) throw new GraphQLError('이미 존재하는 닉네임');
  }

  async hashingPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async signup(user: UserSignupModel): Promise<boolean> {
    await this.existCheck(user);
    const hashedPassword = await this.hashingPassword(user.password);

    try {
      const newUser = await this.dataSource
        .createQueryBuilder()
        .insert()
        .into(User)
        .values({ ...user, password: hashedPassword })
        .execute();
      return newUser.generatedMaps.length ? true : false;
    } catch (error) {
      this.logger.error('회원가입 DAO ERROR');
      console.error(error);
      throw new GraphQLError('회원가입 ERROR');
    }
  }

  async editUserInfo(user: UserEditModel, userId: number): Promise<boolean> {
    await this.existCheck(user);
    if (user.password) {
      const hashedPassword = await this.hashingPassword(user.password);
      try {
        const editedUser = await this.dataSource
          .createQueryBuilder()
          .update(User)
          .set({ ...user, password: hashedPassword })
          .where('id = :id', { id: userId })
          .execute();
        return editedUser.affected ? true : false;
      } catch (error) {
        console.error(error);
        this.logger.error('회원정보 수정 DAO ERROR');
        throw new GraphQLError('회원정보 수정 ERROR');
      }
    } else {
      try {
        const editedUser = await this.dataSource
          .createQueryBuilder()
          .update(User)
          .set({ ...user })
          .where('id = :id', { id: userId })
          .execute();
        return editedUser.affected ? true : false;
      } catch (error) {
        console.error(error);
        this.logger.error('회원정보 수정 DAO ERROR');
        throw new GraphQLError('회원정보 수정 ERROR');
      }
    }
  }
}
