import * as path from 'path';
import * as ora from 'ora';
import * as chalk from 'chalk'
import { Client, MessageMedia } from 'whatsapp-web.js';
import * as fs from 'fs'
import * as qrcode from 'qrcode-terminal'
import { Injectable } from '@nestjs/common';

@Injectable()
export class WhatsappService {
    client: Client;
    SESSION_FILE_PATH: string;
    sessionData: any
    constructor() {
        this.SESSION_FILE_PATH = path.join(__dirname, '..', '..', '..', 'session.json');
        console.log(this.SESSION_FILE_PATH);

        (fs.existsSync(this.SESSION_FILE_PATH)) ? this.withSession() : this.withOutSession();
    }
    /**
    * Revisamos si tenemos credenciales guardadas para inciar sessio
    * este paso evita volver a escanear el QRCODE
    */
    public withSession() {
        // Si exsite cargamos el archivo con las credenciales
        const spinner = ora(`Cargando ${chalk.yellow('Validando session con Whatsapp...')}`);
        this.sessionData = require(this.SESSION_FILE_PATH);
        spinner.start();
        this.client = new Client({
            session: this.sessionData
        });

        this.client.on('ready', () => {
            console.log('Client is ready!');
            spinner.stop();

            // this.connectionReady();

        });

        this.client.on('auth_failure', () => {
            spinner.stop();
            console.log('** Error de autentificacion vuelve a generar el QRCODE (Borrar el archivo session.json) **');
        })
        this.client.initialize();
    }

    /**
     * Generamos un QRCODE para iniciar sesion
     */
    public withOutSession() {
        console.log('No tenemos session guardada');
        this.client = new Client({});
        this.client.on('qr', qr => {
            qrcode.generate(qr, { small: true });
        });

        this.client.on('ready', () => {
            console.log('Client is ready!');
            // this.connectionReady();
        });

        this.client.on('auth_failure', () => {
            console.log('** Error de autentificacion vuelve a generar el QRCODE **');
        })


        this.client.on('authenticated', (session) => {
            // Guardamos credenciales de de session para usar luego
            this.sessionData = session;
            fs.writeFile(this.SESSION_FILE_PATH, JSON.stringify(session), function (err) {
                if (err) {
                    console.log(err);
                }
            });
        });

        this.client.initialize();
    }

    // public connectionReady() {
    //     this.client.on('message', async msg => {
    //         const { from, to, body } = msg;
    //         //34691015468@c.us
    //         // console.log(msg.hasMedia);
    //         console.log(body);
    //         this.client.sendMessage(from, body);
    //     });
    // }

    async sendMediaPath(number: string, fileName: string): Promise<void> {
        number = number.replace('@c.us', '');
        number = `${number}@c.us`
        const media = MessageMedia.fromFilePath(`./../mediaSend/${fileName}`);
        await this.client.sendMessage(number, media);
    }
    async sendMediaUrl(number: string, url: string): Promise<void> {
        number = number.replace('@c.us', '');
        number = `${number}@c.us`;

        const media = await MessageMedia.fromUrl(url, {
            unsafeMime: true, reqOptions: {},
        });
        await this.client.sendMessage(number, media);
    }
}