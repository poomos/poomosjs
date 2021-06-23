import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CursorArgsInput {
  @Field((type) => String, { nullable: true })
  before: string;

  @Field((type) => String, { nullable: true })
  after: string;

  @Field((type) => Number, { nullable: true })
  first: number;

  @Field((type) => Number, { nullable: true })
  last: number;
}
