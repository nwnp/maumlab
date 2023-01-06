import { User } from 'src/common/database/user.entity';
import { UserEditModel } from './models/edit.model';
import { GqlAuthGuard } from './../auth/guard/gql.auth.guard';
import { AuthService } from './../auth/service/auth.service';
import { UsersService } from './users.service';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserSignupModel } from './models/signup.model';
import { UserLoginModel } from './models/login.model';
import { Token } from 'graphql';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/common/functions/current.user';

@Resolver()
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Mutation(() => String)
  async signup(@Args('user') user: UserSignupModel): Promise<boolean> {
    return await this.usersService.signup(user);
  }

  @Mutation(() => Token)
  async login(@Args('user') user: UserLoginModel): Promise<object> {
    return await this.authService.validateUser(user);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async editUserInfo(
    @Args('user') user: UserEditModel,
    @CurrentUser() userInfo: User,
  ): Promise<boolean> {
    return await this.usersService.editUserInfo(user, userInfo.id);
  }
}
