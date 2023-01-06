import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserSignupModel {
  @Field(() => String)
  email: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  password: string;

  @Field(() => String)
  nickname: string;
}
