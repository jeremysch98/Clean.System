import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderDetailsService {

  constructor(private http: HttpClient) { }

  Get(idpedido?: any): Observable<any> {
    const uri = environment.pathServices.concat("detalles-pedido/all/");
    return this.http.get<any>(uri + idpedido);
  };

  GetById(iddetallepedido?: any): Observable<any> {
    const uri = environment.pathServices.concat("detalles-pedido/");
    return this.http.get<any>(uri + iddetallepedido);
  }

  Insert(
    idservicio: any,
    idpedido: any,
    nombre: string,
    precio: any,
    cantidad: any,
    observacion: string): Observable<any> {
    const uri = environment.pathServices.concat("detalles-pedido");
    return this.http.post<any>(uri, { idservicio, idpedido, nombre, precio, cantidad, observacion });
  }

  Update(iddetallepedido: any,
    idservicio: any,
    idpedido: any,
    nombre: string,
    precio: any,
    cantidad: any,
    observacion: string) {
    const uri = environment.pathServices.concat("detalles-pedido");
    return this.http.put<any>(uri, { iddetallepedido, idservicio, idpedido, nombre, precio, cantidad, observacion });
  }

  Delete(iddetallepedido: any): Observable<string> {
    const uri = environment.pathServices.concat("detalles-pedido/");
    return this.http.delete<any>(uri + iddetallepedido);
  }

}
