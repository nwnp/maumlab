import { GqlAuthGuard } from './../auth/guard/gql.auth.guard';
import { UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PostCreateModel } from './models/create.model';
import { CurrentUser } from 'src/common/functions/current.user';
import { User } from 'src/common/database/user.entity';
import { Post } from 'src/common/database/post.entity';

@Resolver()
export class PostsResolver {
  constructor(private readonly postsService: PostsService) {}

  @Query(() => Post)
  @UseGuards(GqlAuthGuard)
  async getPost(@Args('postId') postId: number): Promise<Post> {
    return await this.postsService.getPost(postId);
  }

  @Query(() => [Post])
  @UseGuards(GqlAuthGuard)
  async searchPosts(@Args('title') title: string): Promise<Post[]> {
    return await this.postsService.searchPosts(title);
  }

  @Query(() => [Post])
  @UseGuards(GqlAuthGuard)
  async myPosts(@CurrentUser() user: User): Promise<Post[]> {
    return await this.postsService.myPosts(user.id);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async createPost(
    @Args('post') post: PostCreateModel,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    return await this.postsService.createPost(post, user.id);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deletePost(
    @Args('postId') postId: number,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    return await this.postsService.deletePost(postId, user.id);
  }
}
