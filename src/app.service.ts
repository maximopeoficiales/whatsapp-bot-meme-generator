import { Injectable } from '@nestjs/common';
import WAWebJS, { Client, MessageMedia } from 'whatsapp-web.js';
import { ApiMemeService } from './apimeme/apimeme.service';
import { MessageService } from './message/message.service';
import { WhatsappService } from './whatsapp/whatsapp.service';

@Injectable()
export class AppService {
  client: Client;
  constructor(
    private readonly _wsService: WhatsappService,
    // private readonly _apiMeme: ApiMemeService,
    private readonly _message: MessageService
  ) {
    const { client } = this._wsService;
    this.client = client;
    this.messageInitilizer();
  }
  messageInitilizer(): void {
    this.client.on('message', async msg => {
      const { from, to, body } = msg;
      console.log(from, body);
      if (body == "!Mostrar opciones" || body == "!Memito") {
        let opciones = this._message.getOptions();
        this.client.sendMessage(from, opciones);
      }

      this.generateMeme(msg);
    });

  }

  generateMeme(msg: WAWebJS.Message): void {
    const { from, body } = msg;

    if (body === "!generateMeme") {
      let text = this._message.setTextWithBr([
        "Para generar un meme escriba ⮕ !generateMeme :id,:top,:bottom",
        "Ejemplo si desea generar un meme con el id: 1 topText: Hola bottomText: Bro ",
        "🔵 Escriba ⮕ !generateMeme 1,Hola,bro",
      ]);
      this.client.sendMessage(from, text)


    }
    if (body.includes("!generateMeme")) {
      console.log("Evaluando parametros...");
      let params = body.replace("!generateMeme", "").trim().split(",");
      console.log(params);
      let idMeme = parseInt(params[0]);
      let topText = params[1];
      let bottomText = params[2];

      let { text, validation, meme } = this._message.getTextAndVerifyMeme(idMeme, topText, bottomText);

      this.client.sendMessage(from, text);
      if (validation) {
        this._wsService.sendMediaUrl(from, meme.url);
      }
    }


  }


}
