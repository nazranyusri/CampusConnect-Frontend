import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'businessQuery',
  pure: true
})
export class BusinessQueryPipe implements PipeTransform {

  transform(businesses: any[], searchKey: string, filterCategory: string): any[] {
    if (!businesses) return [];
    
    let filteredBusinesses = businesses;
    
    if (searchKey) {
      searchKey = searchKey.toLowerCase();
      filteredBusinesses = filteredBusinesses.filter(business => 
        business.businessTitle.toLowerCase().includes(searchKey)
      );
    }

    if (filterCategory) {
      filteredBusinesses = filteredBusinesses.filter(business =>
        business.tag === filterCategory
      );
    }

    return filteredBusinesses;
  }
}
