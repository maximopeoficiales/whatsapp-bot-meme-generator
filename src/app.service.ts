import { Injectable } from '@nestjs/common';
import { ApiMemeService } from './apimeme/apimeme.service';
import { WhatsappService } from './whatsapp/whatsapp.service';

@Injectable()
export class AppService {
  constructor(private readonly _wsService: WhatsappService, private readonly _apiMeme: ApiMemeService) {
    this.messageInitilizer();
  }
  messageInitilizer(): void {
    const { client } = this._wsService;
    client.on('message', async msg => {
      const { from, to, body } = msg;
      console.log(body);
      // client.sendMessage(from,"");
      if (body == "Quieromeme") {
        client.sendMessage(from, this._apiMeme.findById(1).name);
        client.sendMessage(from, this._apiMeme.findById(1).url);
      }


    });
  }
}
