import { Module } from '@nestjs/common';
import { ApiMemeService } from './apimeme.service';

@Module({
  providers: [ApiMemeService]
})
export class ApimemeModule { }
