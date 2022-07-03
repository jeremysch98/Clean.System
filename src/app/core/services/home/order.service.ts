import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }

  GetRowOrder(): Observable<any> {
    const uri = environment.pathServices.concat("pedidos/conteo");
    return this.http.get<any>(uri);
  };

  Get(): Observable<any> {
    const uri = environment.pathServices.concat("pedidos");
    return this.http.get<any>(uri)
  };

  GetById(idpedido?: any): Observable<any> {
    const uri = environment.pathServices.concat("pedidos/");
    return this.http.get<any>(uri + idpedido);
  }

  Insert(fechaIngreso: string,
    fechasalida: string,
    dnicliente: string,
    nombrecliente: string,
    idestadopedido: any,
    idusuario: any): Observable<any> {
    const uri = environment.pathServices.concat("pedidos");
    return this.http.post<any>(uri, { fechaIngreso, fechasalida, dnicliente, nombrecliente, idestadopedido, idusuario });
  }

  Update(idpedido: any,
    fechaIngreso: string,
    fechasalida: string,
    dnicliente: string,
    nombrecliente: string,
    idestadopedido: any,
    idusuario: any) {
    const uri = environment.pathServices.concat("pedidos");
    return this.http.put<any>(uri, { idpedido, fechaIngreso, fechasalida, dnicliente, nombrecliente, idestadopedido, idusuario });
  }
}
