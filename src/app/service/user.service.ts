import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../type/user';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private url = "http://localhost:8081/user"

  constructor(private http: HttpClient) { }

  getAllUsers() : Promise<User[]> {
    return firstValueFrom(this.http.get<User[]>(this.url))
  }

  postUser(user: User) : Promise<User> {
    return firstValueFrom(this.http.post<User>(this.url, user))
  }

  deleteUser(user: User) : Promise<User> {
    return firstValueFrom(this.http.delete<User>(this.url + "/" + user.index))
  }

  putUser(user: User) : Promise<User> {
    return firstValueFrom(this.http.put<User>(this.url, user));
  }

}
