import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StatusOrderService {

  constructor(private http: HttpClient) { }

  Get(): Observable<any> {
    const uri = environment.pathServices.concat("estados-pedido");
    return this.http.get<any>(uri)
  };
}
