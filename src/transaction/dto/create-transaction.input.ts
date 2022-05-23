import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateTransactionInput {
  @Field()
  amount: number;

  @Field()
  from: string;

  @Field()
  to: string;
}
