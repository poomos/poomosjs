import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { IDateRange } from '@poomosjs/core';

@ObjectType()
export class DateRangeType implements IDateRange {
  @Field((type) => Date)
  startDate: Date;
  @Field((type) => Date)
  endDate: Date;
}
