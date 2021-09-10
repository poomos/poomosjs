import { isObject } from '@nestjs/common/utils/shared.utils';

export const isBaseEvent = (eventValue: any) => {
  if (isObject(eventValue)) {
    if (eventValue['type']) {
      return true;
    }
  }
  return false;
};
