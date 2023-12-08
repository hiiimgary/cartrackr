import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import {
  GestureController,
  DomController,
  Platform,
  IonicModule,
} from '@ionic/angular';
import { SafePipe } from 'src/app/shared/pipes/safe.pipe';
import { List } from 'src/app/shared/types/list.types';
import Swiper from 'swiper';
import { SwiperContainer } from 'swiper/element';
import { SwiperOptions } from 'swiper/types';
import { ImageResponse } from '../../../../../../../../cartrackr/libs/cartrackr-shared/src/lib/model/image-response';
import { IONIC_COMPONENTS } from 'src/app/shared/utils/ionic-components';

const CLOSE_MODAL_TRESHOLD = 150;

@Component({
  standalone: true,
  imports: [CommonModule, ...IONIC_COMPONENTS, SafePipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'app-zoomable-swiper',
  templateUrl: './zoomable-swiper.component.html',
  styleUrls: ['./zoomable-swiper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZoomableSwiperComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @Input({ required: true }) set images(images: List<ImageResponse>) {
    this.#images = images;

    if (this.swiperContainer?.nativeElement.swiper) {
      const activeImageIndex =
        this.swiperContainer.nativeElement.swiper.activeIndex >= images.length
          ? images.length - 1
          : this.swiperContainer.nativeElement.swiper.activeIndex;
      this.activeImage = images[activeImageIndex];
    }
  }
  get images(): List<ImageResponse> {
    return this.#images;
  }
  #images!: List<ImageResponse>;
  @Input() startIdx: number = 0;

  @Input() header?: TemplateRef<any>;
  @Input() footer?: TemplateRef<any>;

  @ViewChild('swiper')
  swiperContainer!: ElementRef<SwiperContainer>;
  @ViewChild('content', { read: ElementRef }) contentRef!: ElementRef;

  @Output() onClose = new EventEmitter<void>();

  config!: SwiperOptions;

  activeImage!: ImageResponse;

  constructor(
    private readonly gestureCtrl: GestureController,
    private readonly renderer: Renderer2,
    private readonly domCtrl: DomController,
    private readonly cd: ChangeDetectorRef,
    private readonly plt: Platform,
  ) {}

  ngOnInit() {
    // If index 0 opened, onChangeActiveIndex() is not called
    this.activeImage = this.images[this.startIdx];
  }

  ngAfterViewInit(): void {
    this.initCloseGesture();

    if (this.plt.is('hybrid')) {
      StatusBar.setStyle({ style: Style.Dark });
    }
  }

  ngOnDestroy(): void {
    if (this.plt.is('hybrid')) {
      StatusBar.setStyle({ style: Style.Light });
    }
  }

  identify(_: number, image: ImageResponse): number {
    return image.id;
  }

  onChangeActiveIndex(event: any): void {
    console.log(event);

    // this.activeImage = this.images[swiper[0].activeIndex];
    // // Needed so the rendered template can receive the changes
    // this.cd.detectChanges();
  }

  private initCloseGesture(): void {
    const gesture = this.gestureCtrl.create({
      el: this.contentRef.nativeElement,
      gestureName: 'close',
      direction: 'y',
      onStart: () => {
        this.renderer.setStyle(
          this.contentRef.nativeElement,
          'transition',
          `none`,
        );
      },
      onMove: (ev) => {
        if (ev.deltaY < 0) {
          return;
        }
        this.domCtrl.write(() => {
          this.renderer.setStyle(
            this.contentRef.nativeElement,
            'will-change',
            'transform',
          );
          this.renderer.setStyle(
            this.contentRef.nativeElement,
            'transform',
            `translateY(${ev.deltaY}px)`,
          );
        });
      },
      onEnd: (ev) => {
        if (ev.deltaY > CLOSE_MODAL_TRESHOLD) {
          this.onClose.emit();
        }

        this.domCtrl.write(() => {
          this.renderer.setStyle(
            this.contentRef.nativeElement,
            'transition',
            `0.3s cubic-bezier(0.165, 0.84, 0.44, 1)`,
          );
          this.renderer.setStyle(
            this.contentRef.nativeElement,
            'transform',
            `translateY(0)`,
          );
        });
      },
    });

    gesture.enable(true);
  }
}
