import { Injectable } from '@nestjs/common';
import { ApiMemeService } from 'src/apimeme/apimeme.service';
// import { WhatsappService } from 'src/whatsapp/whatsapp.service';
// import { Client } from 'whatsapp-web.js';
import { config } from '../config';
@Injectable()
export class MessageService {
    constructor(
        private readonly _apiMeme: ApiMemeService,
    ) {
    }
    setTextWithBr(data: string[]): string {
        return data.join("\n");
    }
    getOptions(): string {
        return [
            '👋 Hola, Soy Memito',
            'Soy un bot generador de memes',
            `Tengo estas opciones por momento - Contamos actualmente con: ${this._apiMeme.findAll().length} memes`,
            `✅ Listar ${config.maxPage} memes ⮕ !listMemes`,
            '✅ Generar meme ⮕ !generateMeme',
            '✅ Buscar meme ⮕ !searchMemes',
            '✅ ....',
            // '------',
            // '------',
            // 'Veo que es la primera vez que nos escribes ¿Quieres que te envie un MEME?',
            // 'Responde !Quieromeme'
        ].join("\n");
    }

    // getTextListMemes(page: number = 1): string {
    //     let memesFiltered = this._apiMeme.getPage(page);
    //     console.log(memesFiltered);

    //     return "";
    // }
    getTextAndVerifyMeme(idMeme: number, topText: string, bottomText: string) {
        let text = "😭 Ocurrio un Error intentalo denuevo 😭";
        let validation = false;
        let meme = this._apiMeme.findById(idMeme);
        let urlPlantilla = meme.url;
        console.log(meme);

        if (meme) {
            meme.url = this._apiMeme.generateLinkWithTopAndBottomText(meme.name, topText, bottomText);
            text = this.setTextWithBr([
                `Haz elegido: ${meme.name}`,
                `Plantilla: ${urlPlantilla}`,
                `Con texto Superior: ${topText}`,
                `Y texto Inferior: ${bottomText}`,
                `Generando meme..... 😽😽😽😽`,
            ]);
            validation = true;
        }
        return { text, validation, meme };
    }
}
