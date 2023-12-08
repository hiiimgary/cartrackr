import { Injectable } from '@nestjs/common';
import { Image } from './entity/image.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BufferedFile } from './models/file.model';
import { MinioClientService } from './minio-client.service';
import { ConfigService } from '@nestjs/config';
import { ImageResponse } from '@cartrackr/cartrackr-shared';

@Injectable()
export class ImageService {
  constructor(
    private readonly minio: MinioClientService,
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
    private readonly config: ConfigService
  ) {}

  async storeImages(imagesToUpload: BufferedFile[]): Promise<Image[]> {
    const uploadedFileNames = await Promise.all(
      imagesToUpload.map(async (file) => {
        const uploadedFile = await this.minio.upload(file);
        return uploadedFile.name;
      })
    );

    const images = this.imageRepository.create(
      uploadedFileNames.map((imageName) => ({ imageName }))
    );

    return this.imageRepository.save(images);
  }

  async storeImage(imageToUpload: BufferedFile): Promise<Image> {
    const uploadedFile = await this.minio.upload(imageToUpload);

    const image = this.imageRepository.create({ imageName: uploadedFile.name });

    return this.imageRepository.save(image);
  }

  getPath(fileName: string): string {
    return `http://192.168.1.67:9000/${fileName}`;
    return `${this.config.get('MINIO_ENDPOINT')}:${this.config.get(
      'MINIO_PORT'
    )}/${fileName}`;
  }

  toImageResponse(image: Image): ImageResponse {
    const path: string = this.getPath(image.imageName);
    return {
      id: image.id,
      path: path.startsWith('http') ? path : `http://${path}`,
    };
  }
}
