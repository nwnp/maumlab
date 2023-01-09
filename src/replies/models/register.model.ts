import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@ObjectType()
export class ReplyRegisterModel {
  @Field(() => String)
  content: string;

  @Field(() => Int)
  post_id: number;

  @Field(() => Int)
  @IsOptional()
  replied_id: number;
}
