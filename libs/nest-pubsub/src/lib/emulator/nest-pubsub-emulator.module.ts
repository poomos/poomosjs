import {
  DynamicModule,
  Inject,
  Module,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { EmulatorConfigInterface } from './emulator-config.interface';
import { EmulatorService } from './emulator.service';

@Module({
  controllers: [],
  providers: [],
  exports: [],
})
export class NestPubSubEmulatorModule implements OnApplicationBootstrap {
  constructor(
    @Inject('EMULATOR_CONFIG')
    private readonly config: EmulatorConfigInterface,
    private readonly emulatorService: EmulatorService
  ) {}
  async onApplicationBootstrap() {
    await this.emulatorService.run();
  }
  static register(config: EmulatorConfigInterface): DynamicModule {
    return {
      module: NestPubSubEmulatorModule,
      providers: [
        {
          provide: 'EMULATOR_CONFIG',
          useValue: config,
        },
        EmulatorService,
      ],
      exports: [],
    };
  }
}
