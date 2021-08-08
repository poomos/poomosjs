import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';
import {
  CommandBus,
  CommandModel,
  EventBus,
  EventModel,
} from '@poomosjs/nest-evento';

export class FF extends CommandModel('g', 'test') {}
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private commandBus: CommandBus
  ) {}

  @Get()
  async getData() {
    await this.commandBus.request(new FF());
    return this.appService.getData();
  }
}
