import { Field, InputType } from '@nestjs/graphql';
import { IDateRange } from '@poomosjs/core';

@InputType()
export class DateRangeInput implements IDateRange {
  @Field((type) => Date)
  startDate: Date;
  @Field((type) => Date)
  endDate: Date;
}
