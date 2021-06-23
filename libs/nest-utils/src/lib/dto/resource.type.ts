import { Field, ID, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { IResource } from '@poomosjs/core';

@ObjectType()
export class ResourceType implements IResource {
  @Field(() => ID)
  @IsString()
  id?: string;
}
