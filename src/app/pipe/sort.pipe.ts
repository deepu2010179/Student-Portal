import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'SortByName'
  })
  export class SortPipe implements PipeTransform{
    transform(array: any[], field: string): any[] {
      if (!Array.isArray(array)) {
        return array;
      }
      array.sort((a, b) => {
        const nameA = a[field].toLowerCase();
        const nameB = b[field].toLowerCase();
  
        if (nameA < nameB) {
          return -1;
        } else if (nameA > nameB) {
          return 1;
        } else {
          return 0;
        }
      });
  
      return array;
    }
  }