export interface IGeolocation {
  type: GeolocationFieldType;
  coordinates: number[];
}

export enum GeolocationFieldType {
  Point = 'Point',
}
