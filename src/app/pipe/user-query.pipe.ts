import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userQuery',
  pure: true
})
export class UserQueryPipe implements PipeTransform {

  transform(users: any[], userSearchKey: string, userFilterOption: string): any[] {
    if (!users) return [];

    let filteredUsers = users;
    
    if (userSearchKey) {
      userSearchKey = userSearchKey.toLowerCase();
      filteredUsers = filteredUsers.filter(user => 
        user.username.toLowerCase().includes(userSearchKey) ||
        user.fullName.toLowerCase().includes(userSearchKey)
      );
    }

    if (userFilterOption) {
      filteredUsers = filteredUsers.filter(users =>
        users.role === userFilterOption
      );
    }

    return filteredUsers;
  }
}
