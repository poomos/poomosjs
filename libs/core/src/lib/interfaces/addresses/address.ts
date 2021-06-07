import { IGeolocation } from './geolocation';

export interface IAddress {
  address1?: string;
  address2?: string;
  city?: string;
  country?: string;
  countryCode?: string;
  phone?: string;
  province?: string;
  provinceCode?: string;
  zip?: string;
  formatted?: string;
  company?: string;
  name?: string;
  firstname?: string;
  lastname?:string;
  geolocation?: IGeolocation;
}
