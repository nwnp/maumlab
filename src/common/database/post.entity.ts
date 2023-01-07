import { IsDate, IsNumber, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('post')
export class Post {
  @PrimaryGeneratedColumn()
  @IsNumber()
  id: number;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  @IsString()
  title: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  @IsString()
  content: string;

  @Column({
    type: 'int',
    nullable: false,
  })
  @IsNumber()
  user_id: number;

  @CreateDateColumn()
  @IsDate()
  created_at: Date;

  @UpdateDateColumn()
  @IsDate()
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;
}
