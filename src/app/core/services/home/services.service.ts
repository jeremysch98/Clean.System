import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  constructor(private http: HttpClient) { }

  Get(): Observable<any> {
    const uri = environment.pathServices.concat("servicios");
    return this.http.get<any>(uri)
  };

  GetById(idservicio?: any): Observable<any> {
    const uri = environment.pathServices.concat("servicios/");
    return this.http.get<any>(uri + idservicio);
  }

  Insert(nombre: string,
    precio: any,
    descripcion: string,
    idtiposervicio: any): Observable<any> {
    const uri = environment.pathServices.concat("servicios");
    return this.http.post<any>(uri, { nombre, precio, descripcion, idtiposervicio })
  }

  Update(idservicio: any,
    nombre: string,
    precio: any,
    descripcion: string,
    idtiposervicio: any) {
    const uri = environment.pathServices.concat("servicios");
    return this.http.put<any>(uri, { idservicio, nombre, precio, descripcion, idtiposervicio });
  }

  Delete(idservicio: any): Observable<string> {
    const uri = environment.pathServices.concat("servicios/");
    return this.http.delete<any>(uri + idservicio);
  }

}
