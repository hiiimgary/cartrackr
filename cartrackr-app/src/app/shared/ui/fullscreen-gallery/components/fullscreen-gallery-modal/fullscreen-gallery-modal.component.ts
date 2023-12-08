import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
} from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { List } from 'src/app/shared/types/list.types';
import {
  GalleryFooterDirective,
  GalleryHeaderDirective,
} from '../../directives/gallery-toolbars.directive';
import { ZoomableSwiperComponent } from '../zoomable-swiper/zoomable-swiper.component';
import { CommonModule } from '@angular/common';
import { ImageResponse } from '../../../../../../../../cartrackr/libs/cartrackr-shared/src/lib/model/image-response';
import { IONIC_COMPONENTS } from 'src/app/shared/utils/ionic-components';

@Component({
  standalone: true,
  imports: [CommonModule, ...IONIC_COMPONENTS, ZoomableSwiperComponent],
  selector: 'app-fullscreen-gallery-modal',
  templateUrl: './fullscreen-gallery-modal.component.html',
  styleUrls: ['./fullscreen-gallery-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FullscreenGalleryModalComponent {
  @ContentChild(GalleryHeaderDirective, { read: TemplateRef })
  public header?: TemplateRef<any>;
  @ContentChild(GalleryFooterDirective, { read: TemplateRef })
  public footer?: TemplateRef<any>;

  @Input({ required: true }) images!: List<ImageResponse>;
  @Input() startIndex: number | null = 0;

  @Output() onClose = new EventEmitter<void>();

  constructor(private readonly modalCtrl: ModalController) {}

  onCloseModal(): void {
    this.modalCtrl.dismiss();
  }
}
