import { Injectable } from '@angular/core';
import {
  Camera,
  CameraResultType,
  CameraSource,
  GalleryPhoto,
  Photo,
} from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import {
  catchError,
  concat,
  forkJoin,
  from,
  map,
  Observable,
  of,
  switchMap,
  take,
  tap,
  toArray,
} from 'rxjs';
import { List } from 'src/app/shared/types/list.types';
import { ImageSource } from '../types/camera-source.types';
import parseISO from 'date-fns/parseISO';
import { DraftImage } from '../types/image.types';
import { Filesystem } from '@capacitor/filesystem';

@Injectable({
  providedIn: 'root',
})
export class CameraService {
  getImages$(source: ImageSource): Observable<List<DraftImage>> {
    return source === ImageSource.CAMERA
      ? this.takePhoto$()
      : this.pickImages$();
  }

  private pickImages$(): Observable<List<DraftImage>> {
    return from(
      Camera.pickImages({ quality: 100 }).catch((err) => {
        console.log(err);
        return;
      })
    ).pipe(
      switchMap((images) =>
        forkJoin(images!.photos.map((photo) => this.mapImage$(photo)))
      ),
      catchError(() => of([])),
      take(1)
    );
  }

  private takePhoto$(): Observable<List<DraftImage>> {
    return from(
      Camera.getPhoto({
        quality: 100,
        saveToGallery: true,
        source: CameraSource.Camera,
        resultType: CameraResultType.Uri,
      })
    ).pipe(
      switchMap((image) => this.mapImage$(image).pipe(map((res) => [res]))),
      catchError(() => of([])),
      take(1)
    );
  }

  private mapImage$(photo: GalleryPhoto | Photo): Observable<DraftImage> {
    const path = photo.path ? photo.path : photo.webPath!;
    console.log(path);

    return from(this.fetchImage(path)).pipe(
      map((file) => {
        return {
          path: photo.path
            ? Capacitor.convertFileSrc(photo.path)
            : photo.webPath!,
          file,
        };
      })
    );
  }

  private fetchImage(path: string): Promise<File> {
    return Filesystem.readFile({ path }).then((res) =>
      this.dataUrlToFile(res.data)
    );
  }

  private dataUrlToFile(
    dataUrl: string | Blob,
    fileName: string = 'file.jpeg'
  ): Promise<File> {
    return fetch(`data:image/png;base64,${dataUrl}`)
      .then((res) => res.blob())
      .then((blob) => {
        return new File([blob], fileName, { type: 'image/png' });
      });
  }
}
