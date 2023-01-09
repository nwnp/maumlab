import { IsBoolean, IsNumber, IsString, IsDate } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Post } from './post.entity';
import { User } from './user.entity';

@Entity('reply')
export class Reply {
  @PrimaryGeneratedColumn()
  @IsNumber()
  id: number;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  @IsString()
  content: string;

  // 0 -> 댓글
  // 1 -> 대댓글
  @Column({
    type: 'boolean',
    nullable: false,
  })
  @IsBoolean()
  reply_type: boolean;

  @Column({
    type: 'int',
    nullable: false,
  })
  @IsNumber()
  post_id: number;

  @Column({
    type: 'int',
    nullable: false,
  })
  @IsNumber()
  user_id: number;

  // reply_type이 1일 때 -> 댓글의 id를 insert
  @Column({
    type: 'int',
    nullable: true,
  })
  @IsNumber()
  replied_id: number;

  @CreateDateColumn()
  @IsDate()
  created_at: Date;

  @UpdateDateColumn()
  @IsDate()
  updated_at: Date;

  @ManyToOne(() => Post, (post) => post.replies)
  @JoinColumn([{ name: 'post_id', referencedColumnName: 'id' }])
  post: Post;

  @ManyToOne(() => User, (user) => user.replies)
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;
}
