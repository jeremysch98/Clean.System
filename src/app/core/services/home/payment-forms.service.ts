import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentFormsService {

  constructor(private http: HttpClient) { }

  Get(): Observable<any> {
    const uri = environment.pathServices.concat("formas-pago");
    return this.http.get<any>(uri)
  };

  GetById(idformapago?: any): Observable<any> {
    const uri = environment.pathServices.concat("formas-pago/");
    return this.http.get<any>(uri + idformapago);
  }

  Insert(nombre: string): Observable<any> {
    const uri = environment.pathServices.concat("formas-pago");
    return this.http.post<any>(uri, { nombre })
  }

  Update(idformapago: any,
    nombre: string) {
    const uri = environment.pathServices.concat("formas-pago");
    return this.http.put<any>(uri, { idformapago, nombre });
  }

  Delete(idformapago: any): Observable<string> {
    const uri = environment.pathServices.concat("formas-pago/");
    return this.http.delete<any>(uri + idformapago);
  }
}
