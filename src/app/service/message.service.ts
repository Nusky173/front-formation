import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Message } from '../type/message';
import { firstValueFrom } from 'rxjs';
import { User } from '../type/user';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private url = "http://localhost:8081/message"

  constructor(private http: HttpClient) { }

  getAllMessages() : Promise<Message[]> {
    return firstValueFrom(this.http.get<Message[]>(this.url))
  }

  getAllMessageOfUser(user: User): Promise<Message[]> {
    return firstValueFrom(this.http.get<Message[]>(this.url + "/owner/" + user.index))
  }

  postMessage(message: Message) : Promise<Message> {
    return firstValueFrom(this.http.post<Message>(this.url, message))
  }

  deleteMessage(message: Message) : Promise<Message> {
    return firstValueFrom(this.http.delete<Message>(this.url + "/" + message.index))
  }

  putMessage(message: Message) : Promise<Message> {
    return firstValueFrom(this.http.put<Message>(this.url, message))
  }
}
