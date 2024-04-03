import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Tag } from '../type/tag';

@Injectable({
  providedIn: 'root'
})
export class TagService {

  private url = "http://localhost:8081/tag"

  constructor(private http: HttpClient) { }

  getAllTags() : Promise<Tag[]> {
    return firstValueFrom(this.http.get<Tag[]>(this.url))
  }

  postTag(tag: Tag) : Promise<Tag> {
    return firstValueFrom(this.http.post<Tag>(this.url, tag))
  }

  deleteTag(tag: Tag) : Promise<Tag> {
    return firstValueFrom(this.http.delete<Tag>(this.url + "/" + tag.index))
  }

  putTag(tag: Tag) : Promise<Tag> {
    return firstValueFrom(this.http.put<Tag>(this.url, tag))
  }
}
