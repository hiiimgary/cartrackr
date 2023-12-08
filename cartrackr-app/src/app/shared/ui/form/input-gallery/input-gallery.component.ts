import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { LoadingComponent } from '../../loading/loading.component';
import { InputBaseComponent } from '../input-base/input-base.component';
import { ImageSource } from 'src/app/core/camera/types/camera-source.types';
import { CameraService } from 'src/app/core/camera/services/camera.service';
import { CardButtonComponent } from '../../card-button/card-button.component';
import { ConfirmationModalComponent } from '../../confirmation-modal/confirmation-modal.component';
import { DraftImage } from 'src/app/core/camera/types/image.types';
import { IONIC_COMPONENTS } from 'src/app/shared/utils/ionic-components';

@Component({
  selector: 'app-input-gallery',
  standalone: true,
  imports: [
    CommonModule,
    ...IONIC_COMPONENTS,
    TranslateModule,
    LoadingComponent,
    CardButtonComponent,
    ConfirmationModalComponent,
  ],
  templateUrl: './input-gallery.component.html',
  styleUrls: ['./input-gallery.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: InputGalleryComponent,
      multi: true,
    },
  ],
})
export class InputGalleryComponent extends InputBaseComponent<DraftImage[]> {
  isAddPhotoOpen = false;
  isPhotosLoading$ = new BehaviorSubject<boolean>(false);

  constructor(
    private readonly cameraService: CameraService,
    private readonly cd: ChangeDetectorRef,
  ) {
    super();
  }

  onTakePhotoClick(): void {
    this.getImages(ImageSource.CAMERA);
    this.isAddPhotoOpen = false;
  }

  onAddImagesFromGalleryClick(): void {
    this.getImages(ImageSource.GALLERY);
    this.isAddPhotoOpen = false;
  }

  onChangeValue(images: DraftImage[]): void {
    this.onChange(images);
    this.onTouched();
    this.value = images;
    this.cd.markForCheck();
  }

  private getImages(source: ImageSource): void {
    this.isPhotosLoading$.next(true);
    this.cameraService.getImages$(source).subscribe(
      (images) => {
        this.isPhotosLoading$.next(false);
        this.onChangeValue([...this.value, ...images]);
      },
      () => {
        this.isPhotosLoading$.next(false);
      },
    );
  }
}
