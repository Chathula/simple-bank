import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AccountCreateDTO {
  @Field()
  balance: number;
}
