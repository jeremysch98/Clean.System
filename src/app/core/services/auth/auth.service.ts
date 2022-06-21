import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  validateUser(correo: string, password: string): Observable<any> {
    const uri = environment.pathServices.concat("usuarios/validation");
    return this.http.post<any>(uri, {correo, password});
  }

}
