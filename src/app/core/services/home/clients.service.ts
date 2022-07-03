import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ClientsService {
  token_api_peru: string = "38c255186fe78f6ee7962e0a3c13a55488783003841e5de3dbee095093a37233";

  constructor(private http: HttpClient) { }

  GetByDNI(dni: any): Observable<any> {
    const uri = environment.pathApiPeru.concat("dni/");
    return this.http.get<any>(uri + dni + "?api_token=" + this.token_api_peru)
  };
}
