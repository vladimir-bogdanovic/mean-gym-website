// import { Pipe, PipeTransform } from '@angular/core';

// @Pipe({
//   name: 'stringToImage',
//   standalone: true,
// })
// export class StringToImagePipe implements PipeTransform {
//   transform(imageString: string): string {
//     // Check if the string starts with 'http://' or 'https://', indicating it's a URL
//     if (
//       imageString.startsWith('http://') ||
//       imageString.startsWith('https://')
//     ) {
//       return imageString; // Return the URL as is
//     } else {
//       // Otherwise, assume it's a base64 encoded image and return it as a data URL
//       return 'data:image/png;base64,' + imageString;
//     }
//   }
// }
