import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'clubQuery'
})
export class ClubQueryPipe implements PipeTransform {

  transform(clubs: any[], clubSearchKey: string): any[] {
    if (!clubs) return [];
    
    if (clubSearchKey) {
      clubSearchKey = clubSearchKey.toLowerCase();
      return clubs.filter(club => 
        club.username.toLowerCase().includes(clubSearchKey) ||
        club.fullName.toLowerCase().includes(clubSearchKey)
      );
    }

    return clubs;
  }
}
