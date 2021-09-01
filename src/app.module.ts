import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { WhatsappService } from './whatsapp/whatsapp.service';
import { ApiMemeService } from './apimeme/apimeme.service';
import { MessageService } from './message/message.service';

@Module({
  imports: [],
  controllers: [],
  providers: [AppService, WhatsappService, ApiMemeService, MessageService],
})
export class AppModule {


}
