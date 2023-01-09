import { CurrentUser } from './../common/functions/current.user';
import { RepliesService } from './replies.service';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guard/gql.auth.guard';
import { ReplyRegisterModel } from './models/register.model';
import { User } from 'src/common/database/user.entity';

@Resolver()
export class RepliesResolver {
  constructor(private readonly repliesService: RepliesService) {}

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async registerReply(
    @Args('reply') reply: ReplyRegisterModel,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    return await this.repliesService.registerReply(reply, user.id);
  }
}
