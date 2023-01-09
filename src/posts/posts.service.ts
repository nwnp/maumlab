import { DataSource } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { PostCreateModel } from './models/create.model';
import { GraphQLError } from 'graphql';
import { Post } from 'src/common/database/post.entity';
import { Reply } from 'src/common/database/reply.entity';

@Injectable()
export class PostsService {
  private readonly logger = new Logger('POST');
  constructor(private readonly dataSource: DataSource) {}

  checkPostInfo(title: string, content: string): boolean {
    if (title.trim() === '' || content.trim() === '')
      throw new GraphQLError('제목 혹은 내용을 제대로 입력해주세요.');

    return true;
  }

  // 단순 참조 목적
  async getPostById(postId: number): Promise<Post> {
    try {
      const post = await this.dataSource
        .createQueryBuilder()
        .select('post')
        .from(Post, 'post')
        .where('post.id = :id', { id: postId })
        .getOne();
      return post;
    } catch (error) {
      console.error(error);
      this.logger.error('게시글 확인 DAO ERROR');
      throw new GraphQLError('게시글 확인 DAO ERROR');
    }
  }

  // 게시글 확인
  // query($postId: Int!) {
  //   getPostDetail(postId: $postId) {
  //     id
  //     title
  //     content
  //     replies {
  //       id
  //       content
  //       reply_type
  //       replied_id
  //       user {
  //         nickname
  //         email
  //       }
  //     }
  //   }
  // }
  async getPostDetail(postId: number): Promise<Post> {
    try {
      const post = await this.dataSource
        .getRepository(Post)
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.replies', 'reply')
        .leftJoinAndSelect('reply.user', 'replies')
        .where('post.id = :id', { id: postId })
        .getOne();
      return post;
    } catch (error) {
      console.error(error);
      this.logger.error('게시글/댓글 확인 DAO ERROR');
      throw new GraphQLError('게시글/댓글 확인 DAO ERROR');
    }
  }

  // 게시글 등록
  async createPost(
    postInfo: PostCreateModel,
    userId: number,
  ): Promise<boolean> {
    this.checkPostInfo(postInfo.title, postInfo.content);
    try {
      const newPost = await this.dataSource
        .createQueryBuilder()
        .insert()
        .into(Post)
        .values({ ...postInfo, user_id: userId })
        .execute();
      return newPost.generatedMaps.length ? true : false;
    } catch (error) {
      console.error(error);
      this.logger.error('게시글 등록 DAO ERROR');
      throw new GraphQLError('게시글 등록 DAO ERROR');
    }
  }

  // 게시글 검색(title로 검색)
  async searchPosts(title: string): Promise<Post[]> {
    try {
      const posts = await this.dataSource
        .createQueryBuilder()
        .select('post')
        .from(Post, 'post')
        .where(`post.title LIKE '%${title}%'`)
        .getMany();
      return posts;
    } catch (error) {
      console.error(error);
      this.logger.error('게시글 검색 DAO ERROR');
      throw new GraphQLError('게시글 검색 DAO ERROR');
    }
  }

  // 게시글 삭제
  async deletePost(postId: number, userId: number): Promise<boolean> {
    const isExistPost = await this.getPostById(postId);
    if (!isExistPost) throw new GraphQLError('존재하지 않는 게시글');
    if (isExistPost.user_id !== userId)
      throw new GraphQLError('본인 게시글이 아닙니다.');

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      this.logger.verbose('게시글 삭제 트랜잭션 시작');
      await this.dataSource
        .createQueryBuilder()
        .delete()
        .from(Reply)
        .where('post_id = :post_id', { post_id: postId })
        .execute();
      const deletedPost = await this.dataSource
        .createQueryBuilder()
        .delete()
        .from(Post)
        .where('id = :id', { id: postId })
        .execute();
      await queryRunner.commitTransaction();
      this.logger.verbose('게시글 삭제 트랜잭션 완료');
      return deletedPost.affected ? true : false;
    } catch (error) {
      console.error(error);
      await queryRunner.rollbackTransaction();
      this.logger.error('게시글 삭제 트랜잭션 Rollback');
      new GraphQLError('게시글 삭제 DAO ERROR');
    } finally {
      await queryRunner.release();
      this.logger.verbose('게시글 삭제 트랜잭션 Released');
    }
  }

  // 내가 쓴 글 확인
  async myPosts(userId: number): Promise<Post[]> {
    try {
      const posts = await this.dataSource
        .createQueryBuilder()
        .select('post')
        .from(Post, 'post')
        .where('post.user_id = :user_id', { user_id: userId })
        .orderBy('created_at', 'DESC')
        .getMany();
      return posts;
    } catch (error) {
      console.error(error);
      this.logger.error('내가 쓴 글 DAO ERROR');
      throw new GraphQLError('내가 쓴 글 DAO ERROR');
    }
  }
}
