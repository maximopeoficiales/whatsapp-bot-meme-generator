import { Injectable } from '@nestjs/common';
import { Meme } from 'src/types/meme';
import * as dataMeme from '../../data/memes.json';
import { config } from "../config";
@Injectable()
export class ApiMemeService {

    getPage(page: number = 1): Meme[] {
        // 2 * 5
        const { maxPage } = config;
        let maxMeme = maxPage * page;
        return dataMeme.slice(maxMeme - maxPage, maxMeme);
    }

    findById(id: number): Meme {
        return dataMeme.find(e => e.id === id);
    }

    findByQuery(search: string): Meme[] {
        return dataMeme.filter(e => e.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()) || e.id === parseInt(search));
    }

    findAll(): Meme[] {
        return dataMeme;
    }

    length(): number {
        return dataMeme.length;
    }
    generateLinkWithTopAndBottomText(name: string, topText: string, bottomText: string): string {
        // name = encodeURI(name);
        topText = encodeURI(topText ?? "");
        bottomText = encodeURI(bottomText ?? "");
        return `https://apimeme.com/meme?meme=${name ?? ""}&top=${topText ?? ""}&bottom=${bottomText ?? ""}`;
    }


}
