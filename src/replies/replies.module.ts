import { Module } from '@nestjs/common';
import { RepliesService } from './replies.service';
import { RepliesResolver } from './replies.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reply } from 'src/common/database/reply.entity';
import { UsersModule } from 'src/users/users.module';
import { PostsModule } from 'src/posts/posts.module';

@Module({
  imports: [TypeOrmModule.forFeature([Reply]), UsersModule, PostsModule],
  providers: [RepliesService, RepliesResolver],
})
export class RepliesModule {}
