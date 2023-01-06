import { Field, ObjectType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@ObjectType()
export class UserEditModel {
  @Field(() => String)
  @IsOptional()
  email: string;

  @Field(() => String)
  @IsOptional()
  password: string;

  @Field(() => String)
  @IsOptional()
  name: string;

  @Field(() => String)
  @IsOptional()
  nickname: string;
}
