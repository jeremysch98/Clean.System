import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  Get(): Observable<any> {
    const uri = environment.pathServices.concat("usuarios");
    return this.http.get<any>(uri)
  };

  GetById(idusuario?: any): Observable<any> {
    const uri = environment.pathServices.concat("usuarios/");
    return this.http.get<any>(uri + idusuario);
  }
}
