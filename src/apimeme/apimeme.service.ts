import { Injectable } from '@nestjs/common';
import { Meme } from 'src/types/meme';
import * as dataMeme from '../../data/memes.json';
@Injectable()
export class ApiMemeService {

    findById(id: number): Meme {
        return dataMeme.find(e => e.id === id);
    }

    findByQuery(search: string): Meme[] {
        return dataMeme.filter(e => e.name.includes(search));
    }

    findAll(): Meme[] {
        return dataMeme;
    }

    length(): number {
        return dataMeme.length;
    }
    generateLinkWithTopAndBottomText(name: string, topText: string, bottomText: string): string {
        return `https://apimeme.com/meme?meme=${name}&top=${topText}&bottom=${bottomText}`;
    }


}
