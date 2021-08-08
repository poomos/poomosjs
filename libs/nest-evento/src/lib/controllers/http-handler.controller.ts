import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { MessageHandler } from '../handlers/message-handler';
import { EventoConfigService } from '../services/config.service';

@Controller()
export class HttpHandlerController {
  constructor(
    private readonly messageHandler: MessageHandler,
    private readonly config: EventoConfigService
  ) {}

  @Post('evento/http-request')
  public async root(
    @Query('token') token: string,
    @Body() message: any
  ): Promise<void> {
    const verificationToken = this.config.requestResponseToken;
    if (verificationToken) {
      if (verificationToken !== token)
        throw new HttpException('Bad token', HttpStatus.FORBIDDEN);
    }
    return this.messageHandler.onRequest(message);
  }
}
