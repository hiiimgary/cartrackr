import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import formatISO from 'date-fns/formatISO';
import { catchError, from, map, Observable, of, take } from 'rxjs';
import { Image, ImageToStore, StoredImage } from 'src/app/pages/collection/types/plant.types';
import { UtilsService } from 'src/app/shared/services/utils.service';

@Injectable({
  providedIn: 'root',
})
export class FileStorageService {
  constructor(private readonly utils: UtilsService) {}

  saveImageToStorage$(image: ImageToStore, directory: string = ''): Observable<StoredImage> {
    const imagePath = `${directory ? `${directory}/` : ''}${image.id}.${image.format}`;
    const saveImage = Filesystem.readFile({ path: image.internalPath })
      .then((result) => {
        return Filesystem.writeFile({
          data: result.data,
          path: imagePath,
          directory: Directory.Data,
          recursive: true,
        });
      })
      .then((result) => {
        const savedImage: StoredImage = {
          id: image.id,
          relativePath: imagePath,
          date: formatISO(image.date),
          isThumbnail: image.isThumbnail,
        };
        return savedImage;
      });

    return from(saveImage).pipe(take(1));
  }

  getAbsoluteImagePath$(url: string): Observable<string | null> {
    return from(Filesystem.getUri({ path: url, directory: Directory.Data }).catch(() => ({ uri: null }))).pipe(
      map((result) => (result.uri ? Capacitor.convertFileSrc(result.uri) : null))
    );
  }

  deleteImage$(url: string): Observable<unknown> {
    return from(
      Filesystem.deleteFile({
        path: url,
        directory: Directory.Data,
      })
    );
  }

  deleteDirectory$(url: string): Observable<unknown> {
    return from(
      Filesystem.rmdir({
        directory: Directory.Data,
        path: url,
        recursive: true,
      })
    );
  }
}
