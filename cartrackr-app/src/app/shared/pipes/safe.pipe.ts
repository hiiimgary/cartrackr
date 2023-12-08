import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Pipe({
  name: 'safe',
  standalone: true,
})
export class SafePipe implements PipeTransform {
  constructor(private readonly sanitize: DomSanitizer) {}

  transform(url: string): SafeUrl {
    return this.sanitize.bypassSecurityTrustUrl(url);
  }
}
