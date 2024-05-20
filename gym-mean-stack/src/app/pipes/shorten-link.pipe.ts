import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'shortenLink',
})
export class ShortenLinkPipe implements PipeTransform {
  transform(value: string): string {
    if (value.length <= 20) {
      return value;
    } else {
      return (
        value.substring(0, 10) + '...' + value.substring(value.length - 10)
      );
    }
  }
}
