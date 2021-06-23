import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Type } from '@nestjs/common';

@ObjectType()
export class CursorInfoType {
  @Field((type) => Boolean)
  hasNextPage: boolean;

  @Field((type) => Boolean)
  hasPreviousPage: boolean;

  @Field((type) => String, { nullable: true })
  startCursor: string;

  @Field((type) => String, { nullable: true })
  endCursor: string;
}

export function ConnectionPager<T>(classRef: Type<T>): any {
  @ObjectType(`${classRef.name}Edge`)
  abstract class EdgeType {
    @Field((type) => String)
    cursor: string;

    @Field((type) => classRef)
    node: T;
  }

  @ObjectType({ isAbstract: true })
  abstract class PaginatedType {
    @Field((type) => [EdgeType], { nullable: true })
    edges: EdgeType[];

    @Field((type) => [classRef], { nullable: true })
    nodes: T[];

    @Field((type) => Int)
    totalCount: number;

    @Field((type) => CursorInfoType)
    cursorInfo: CursorInfoType;
  }
  return PaginatedType;
}
