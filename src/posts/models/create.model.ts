import { ObjectType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@ObjectType()
export class PostCreateModel {
  @Field(() => String)
  @IsString()
  title: string;

  @Field(() => String)
  @IsString()
  content: string;
}
