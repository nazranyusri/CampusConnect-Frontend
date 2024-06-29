import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'programQuery',
  pure: true
})
export class ProgramQueryPipe implements PipeTransform {
  transform(programs: any[], searchKey: string, filterCategory: string): any[] {
    if (!programs) return [];
    
    let filteredPrograms = programs;
    
    if (searchKey) {
      searchKey = searchKey.toLowerCase();
      filteredPrograms = filteredPrograms.filter(program => 
        program.programTitle.toLowerCase().includes(searchKey)
      );
    }

    if (filterCategory) {
      filteredPrograms = filteredPrograms.filter(program =>
        program.tag === filterCategory
      );
    }

    return filteredPrograms;
  }
}
