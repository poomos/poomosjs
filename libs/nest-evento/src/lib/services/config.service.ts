import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { IEventoConfig } from '../interfaces/core/config.interface';

@Injectable()
export class EventoConfigService {
  constructor(
    private configService: ConfigService<{ nest_evento: IEventoConfig }>
  ) {}

  get config(): IEventoConfig {
    return this.configService.get('nest_evento');
  }

  get requestResponse(): IEventoConfig['requestResponse'] {
    return this.config?.requestResponse;
  }

  get publishSubscribe(): IEventoConfig['publishSubscribe'] {
    return this.config?.publishSubscribe;
  }

  get verificationToken(): IEventoConfig['verificationToken'] {
    return this.config?.verificationToken;
  }

  get requestResponseToken(): IEventoConfig['verificationToken'] {
    return (
      this.config?.requestResponse?.verificationToken || this.verificationToken
    );
  }

  get publishSubscribeToken(): IEventoConfig['verificationToken'] {
    return (
      this.config?.publishSubscribe?.verificationToken || this.verificationToken
    );
  }
}
