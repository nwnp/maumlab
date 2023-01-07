import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserSecessionModel {
  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;
}
