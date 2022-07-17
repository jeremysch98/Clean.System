import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http: HttpClient) { }

  GetByIdPedido(idPedido?: any): Observable<any> {
    const uri = environment.pathServices.concat("boletas/");
    return this.http.get<any>(uri + idPedido);
  }

  Insert(
    fechaemision: any,
    subtotal: any,
    igv: any,
    total: any,
    idformapago: any,
    idpedido: any): Observable<any> {
    const uri = environment.pathServices.concat("boletas");
    return this.http.post<any>(uri, { fechaemision, subtotal, igv, total, idformapago, idpedido });
  }
  
}
