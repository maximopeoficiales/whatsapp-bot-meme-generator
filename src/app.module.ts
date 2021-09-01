import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { WhatsappService } from './whatsapp/whatsapp.service';
import { ApimemeModule } from './apimeme/apimeme.module';

@Module({
  imports: [ApimemeModule],
  controllers: [],
  providers: [AppService, WhatsappService],
})
export class AppModule {


}
