import { Pipe, PipeTransform } from '@angular/core';
import format from 'date-fns/format';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import * as locales from 'date-fns/locale';

export type DateDisplayType = 'date' | 'distance';

@Pipe({
  name: 'date',
  standalone: true,
})
export class DatePipe implements PipeTransform {
  transform(value: Date | undefined, dateFormat: string = 'yyyy MMMM d.', type: DateDisplayType = 'date'): string {
    if (!value) {
      return '';
    }
    if (type === 'distance') {
      return formatDistanceToNow(value, { addSuffix: true, locale: locales['enUS'] });
    }

    return format(value, dateFormat, { locale: locales['enUS'] });
  }
}
