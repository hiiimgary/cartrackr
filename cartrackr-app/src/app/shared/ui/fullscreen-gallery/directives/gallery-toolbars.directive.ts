import { Directive } from '@angular/core';
import { ImageResponse } from '../../../../../../../cartrackr/libs/cartrackr-shared/src/lib/model/image-response';

type GalleryToolbarTemplateContext = {
  readonly $implicit: ImageResponse;
};

@Directive({
  standalone: true,
  selector: 'ng-template[appGalleryHeader]',
})
export class GalleryHeaderDirective {
  public static ngTemplateContextGuard(
    dir: GalleryHeaderDirective,
    ctx: unknown
  ): ctx is GalleryToolbarTemplateContext {
    return true;
  }
}

@Directive({
  standalone: true,
  selector: 'ng-template[appGalleryFooter]',
})
export class GalleryFooterDirective {
  public static ngTemplateContextGuard(
    dir: GalleryFooterDirective,
    ctx: unknown
  ): ctx is GalleryToolbarTemplateContext {
    return true;
  }
}
