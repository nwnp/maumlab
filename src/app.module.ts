import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { User } from './common/database/user.entity';
import { LoggerMiddle } from './common/middlewares/logger.middleware';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { Post } from './common/database/post.entity';
import { Reply } from './common/database/reply.entity';
import { RepliesModule } from './replies/replies.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'maumlab',
      synchronize: true,
      logging: false,
      entities: [User, Post, Reply],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      debug: false,
      cache: 'bounded',
      playground: true,
      typePaths: ['./**/*.graphql'],
    }),
    UsersModule,
    AuthModule,
    PostsModule,
    RepliesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer.apply(LoggerMiddle).forRoutes('*');
//   }
// }
export class AppModule {}
