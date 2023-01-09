import { PostsService } from './../posts/posts.service';
import { GraphQLError } from 'graphql';
import { DataSource } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { ReplyRegisterModel } from './models/register.model';
import { Reply } from 'src/common/database/reply.entity';

@Injectable()
export class RepliesService {
  private readonly logger = new Logger('REPLY');
  constructor(
    private readonly dataSource: DataSource,
    private readonly postsService: PostsService,
  ) {}

  async getReplyById(replyId: number): Promise<Reply> {
    try {
      const reply = await this.dataSource
        .createQueryBuilder()
        .select('reply')
        .from(Reply, 'reply')
        .where('reply.id = :id', { id: replyId })
        .getOne();
      return reply;
    } catch (error) {
      console.error(error);
      this.logger.error('댓글 유무 확인 DAO ERROR');
      throw new GraphQLError('댓글 유무 확인 DAO ERROR');
    }
  }

  async registerReply(
    reply: ReplyRegisterModel,
    userId: number,
  ): Promise<boolean> {
    // check valid post
    const isExistPost = await this.postsService.getPostById(reply.post_id);
    if (!isExistPost) throw new GraphQLError('존재하지 않는 게시글');

    // 대댓글일 때
    if (reply.replied_id) {
      this.logger.debug('대댓글 등록');
      const isExistReply = await this.getReplyById(reply.replied_id);
      if (!isExistReply) throw new GraphQLError('존재하지 않는 댓글');
      try {
        const newRReply = await this.dataSource
          .createQueryBuilder()
          .insert()
          .into(Reply)
          .values({
            ...reply,
            user_id: userId,
            reply_type: true,
          })
          .execute();
        return newRReply.generatedMaps.length ? true : false;
      } catch (error) {
        console.error(error);
        this.logger.error('대댓글 등록 DAO ERROR');
        throw new GraphQLError('대댓글 등록 DAO ERROR');
      }
    } else {
      // 그냥 댓글일 때
      this.logger.debug('댓글 등록');
      try {
        const newReply = await this.dataSource
          .createQueryBuilder()
          .insert()
          .into(Reply)
          .values({
            ...reply,
            user_id: userId,
            reply_type: false,
            replied_id: null,
          })
          .execute();
        return newReply.generatedMaps.length ? true : false;
      } catch (error) {
        console.error(error);
        this.logger.error('댓글 등록 DAO ERROR');
        throw new GraphQLError('댓글 등록 DAO ERROR');
      }
    }
  }
}
