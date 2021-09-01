import { Injectable } from '@nestjs/common';
import { Client, Message } from 'whatsapp-web.js';
import { ApiMemeService } from './apimeme/apimeme.service';
import { MessageService } from './message/message.service';
import { Meme } from './types/meme';
import { WhatsappService } from './whatsapp/whatsapp.service';

@Injectable()
export class AppService {
  client: Client;
  constructor(
    private readonly _wsService: WhatsappService,
    private readonly _message: MessageService,
    private readonly _apiMeme: ApiMemeService,
  ) {
    const { client } = this._wsService;
    this.client = client;
    this.messageInitilizer();
  }
  async messageInitilizer() {
    this.client.on('message', async msg => {
      const { from, to, body } = msg;
      console.log(from, body);
      if (body == "!MostrarOpciones" || body == "!Memito") {
        let opciones = this._message.getOptions();
        await this.client.sendMessage(from, opciones);
      }

      await this.generateMeme(msg);
      await this.listMemes(msg);
      await this.searchMemes(msg);
    });

  }

  async generateMeme(msg: Message) {
    const { from, body } = msg;

    if (body === "!generateMeme") {
      let text = this._message.setTextWithBr([
        "Para generar un meme escriba ⮕ !generateMeme :id,:top,:bottom",
        "Ejemplo si desea generar un meme con el id: 1 topText: Hola bottomText: Bro ",
        "🔵 Escriba ⮕ !generateMeme 1,Hola,bro",
      ]);
      await this.client.sendMessage(from, text)


    }
    if (body.includes("!generateMeme")) {
      console.log("Evaluando parametros...");
      let params = body.replace("!generateMeme", "").trim().split(",");
      console.log(params);
      let idMeme = parseInt(params[0]);
      let topText = params[1];
      let bottomText = params[2];

      let { text, validation, meme } = this._message.getTextAndVerifyMeme(idMeme, topText, bottomText);

      await this.client.sendMessage(from, text);
      if (validation) {
        await this._wsService.sendMediaUrl(from, meme.url);
      }
    }


  }

  async listMemes(msg: Message) {
    const { from, body } = msg;

    if (body === "!listMemes") {
      await this.client.sendMessage(from, "💬 Lista de memes Pagina: 1 💬");
      await this.sendMemesImages(from, this._apiMeme.getPage());
      await this.client.sendMessage(from, this._message.setTextWithBr([
        "🔵 Para ver la siguiente pagina",
        "👉 Escriba ⮕ !listMemes 2",
        "Y asi sucesivamente"]));

    }

    if (body.includes("!listMemes")) {
      let page = body.replace("!listMemes", "").trim();
      if (Number.isInteger(parseInt(page))) {
        await this.sendMemesImages(from, this._apiMeme.getPage(parseInt(page)));
      } else {
        if (page !== "") {
          await this.client.sendMessage(from, "La pagina debe ser un numero, intentelo de nuevo 😒😒");
        }
      }

    }
  }
  async searchMemes(msg: Message) {
    const { from, body } = msg;

    if (body === "!searchMemes") {
      await this.client.sendMessage(from, this._message.setTextWithBr([
        "👉 Escriba ⮕ !listMemes :busqueda",
        "👽 Ejemplo: ⮕ !listMemes spiderman"]));
    }

    if (body.includes("!searchMemes")) {
      let search = body.replace("!searchMemes", "").trim();
      if (search !== "") {
        if (search.length >= 3) {
          await this.client.sendMessage(from, `💬 Estas buscando ${search}💬`);
          await this.sendMemesImages(from, this._apiMeme.findByQuery(search));
        } else {
          await this.client.sendMessage(from, `No se permiten busquedas con menos de 3 digitos, intentelo de nuevo 😒😒`);
        }
      }
    }
  }

  async sendMemesImages(from: string, memes: Meme[]) {
    if (memes.length > 0) {
      memes.forEach(async (meme) => {
        await this.client.sendMessage(from, `Meme ${meme.id} - ${meme.name}`);
        await this._wsService.sendMediaUrl(from, meme.url);

      });
    } else {
      await this.client.sendMessage(from, `No hay memes disponibles, intentelo de nuevo 😒😒`);
    }
  }

}
