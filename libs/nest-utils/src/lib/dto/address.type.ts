import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
import { GeolocationFieldType, IGeolocation } from '@poomosjs/core';

registerEnumType(GeolocationFieldType, {
  name: 'GeolocationFieldType',
});

@ObjectType()
export class AddressType {
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

  @Field((type) => GeolocationType, { nullable: true })
  geolocation: IGeolocation;
}

@ObjectType()
export class GeolocationType {
  @Field((type) => GeolocationFieldType)
  @IsString()
  @IsNotEmpty()
  type: GeolocationFieldType;

  @Field(() => [Number])
  coordinates: number[];
}
