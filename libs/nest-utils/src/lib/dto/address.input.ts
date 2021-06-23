import { Field, InputType } from '@nestjs/graphql';
import { GeolocationFieldType, IAddress, IGeolocation } from '@poomosjs/core';

@InputType()
export class AddressInput implements IAddress {
  @Field((type) => String, { nullable: true })
  address1?: string;
  @Field((type) => String, { nullable: true })
  address2?: string;
  @Field((type) => String, { nullable: true })
  city?: string;
  @Field((type) => String, { nullable: true })
  country?: string;
  @Field((type) => String, { nullable: true })
  countryCode?: string;
  @Field((type) => String, { nullable: true })
  phone?: string;
  @Field((type) => String, { nullable: true })
  province?: string;
  @Field((type) => String, { nullable: true })
  provinceCode?: string;
  @Field((type) => String, { nullable: true })
  zip?: string;
  @Field((type) => String, { nullable: true })
  formatted?: string;
  @Field((type) => String, { nullable: true })
  company?: string;
  @Field((type) => String, { nullable: true })
  name?: string;
  @Field((type) => String, { nullable: true })
  firstname?: string;
  @Field((type) => String, { nullable: true })
  lastname?: string;

  @Field((type) => GeolocationInput, { nullable: true })
  geolocation: IGeolocation;
}

@InputType()
export class GeolocationInput {
  @Field((type) => GeolocationFieldType, {
    defaultValue: GeolocationFieldType.Point,
  })
  type: GeolocationFieldType;

  @Field(() => [Number])
  coordinates: number[];
}
