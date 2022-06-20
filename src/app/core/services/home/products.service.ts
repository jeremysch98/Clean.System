import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private http: HttpClient) { }

  Get(): Observable<any> {
    const uri = environment.pathServices.concat("product/list");
    return this.http.get<any>(uri)
  };

  GetById(_id?: string): Observable<any> {
    const uri = environment.pathServices.concat("product/list/" + _id);
    return this.http.get<any>(uri);
  }

  Insert(imagenUrl: any,
    tipo: string,
    dia: string,
    nombre: string,
    descripcion: string,
    precio: any,
    cantidadDisponible: any,
    calorias: any,
    carbohidratos: any,
    proteinas: any,
    grasas: any,
    peso: any): Observable<any> {
    const uri = environment.pathServices.concat("product/insert");
    return this.http.post<any>(uri, { imagenUrl, tipo, dia, nombre, descripcion, precio, cantidadDisponible, calorias, carbohidratos, proteinas, grasas, peso })
  }

  Update(_id: any,
    imagenUrl: any,
    tipo: string,
    dia: string,
    nombre: string,
    descripcion: string,
    precio: any,
    cantidadDisponible: any,
    calorias: any,
    carbohidratos: any,
    proteinas: any,
    grasas: any,
    peso: any) {
    const uri = environment.pathServices.concat("product/update/");
    return this.http.put<any>(uri + _id, { imagenUrl, tipo, dia, nombre, descripcion, precio, cantidadDisponible, calorias, carbohidratos, proteinas, grasas, peso });
  }

  Delete(_id: string): Observable<string> {
    const uri = environment.pathServices.concat("product/delete/");
    return this.http.delete<string>(uri + _id);
  }
}
