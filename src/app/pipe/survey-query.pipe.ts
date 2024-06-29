import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'surveyQuery',
  pure: true
})
export class SurveyQueryPipe implements PipeTransform {

  transform(surveys: any[], searchKey: string): any[] {
    if (!surveys) return [];
    
    if (searchKey) {
      searchKey = searchKey.toLowerCase();
      return surveys.filter(survey => 
        survey.surveyTitle.toLowerCase().includes(searchKey)
      );
    }

    return surveys;
  }
}
