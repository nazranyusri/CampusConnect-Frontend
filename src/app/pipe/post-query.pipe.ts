import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'postQuery',
  pure: true
})
export class PostQueryPipe implements PipeTransform {

  transform(posts: any[], postSearchKey: string): any[] {
    if (!posts || !postSearchKey) return posts;

    const searchKey = postSearchKey.toLowerCase();

    return posts.filter(post => {
      // Check if the post object has any of the specified attributes
      return (
        ('programTitle' in post && post.programTitle.toLowerCase().includes(searchKey)) ||
        ('businessTitle' in post && post.businessTitle.toLowerCase().includes(searchKey)) ||
        ('surveyTitle' in post && post.surveyTitle.toLowerCase().includes(searchKey))
      );
    });
  }
}