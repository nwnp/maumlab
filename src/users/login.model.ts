import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserLoginModel {
  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;
}
