import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import { BufferedFile } from './models/file.model';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MinioClientService {
  private readonly logger: Logger;
  private readonly baseBucket = this.config.get<string>('MINIO_BUCKET');

  public get client() {
    return this.minio.client;
  }

  constructor(
    private readonly minio: MinioService,
    private readonly config: ConfigService
  ) {
    this.logger = new Logger('MinioStorageService');
  }

  public async upload(
    file: BufferedFile,
    baseBucket: string = this.baseBucket
  ): Promise<{ name: string }> {
    if (
      !(
        file.mimetype.includes('jpeg') ||
        file.mimetype.includes('png') ||
        file.mimetype.includes('jpg')
      )
    ) {
      throw new HttpException('Error uploading file', HttpStatus.BAD_REQUEST);
    }
    const tempFileName = Date.now().toString();
    const hashedFileName = crypto
      .createHash('md5')
      .update(tempFileName)
      .digest('hex');
    const ext = file.originalname.substring(
      file.originalname.lastIndexOf('.'),
      file.originalname.length
    );
    const metaData = {
      'Content-Type': file.mimetype,
    };
    const fileName = `${hashedFileName + ext}`;
    const fileBuffer = file.buffer;

    await this.client
      .putObject(baseBucket, fileName, fileBuffer, metaData)
      .catch((err) => {
        this.logger.error(err);
        this.logger.log(process.env.MINIO_PORT);
        throw new HttpException('Error uploading file', HttpStatus.BAD_REQUEST);
      });

    return {
      name: `${this.config.get('MINIO_BUCKET')}/${fileName}`,
    };
  }

  async delete(objetName: string, baseBucket: string = this.baseBucket) {
    await this.client.removeObject(baseBucket, objetName).catch((e) => {
      throw new HttpException(
        'Oops Something wrong happend',
        HttpStatus.BAD_REQUEST
      );
    });
  }
}
