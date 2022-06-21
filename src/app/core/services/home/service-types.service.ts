import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ServiceTypesService {

  constructor(private http: HttpClient) { }

  Get(): Observable<any> {
    const uri = environment.pathServices.concat("tipos-servicio");
    return this.http.get<any>(uri)
  };

  GetById(idtiposervicio?: any): Observable<any> {
    const uri = environment.pathServices.concat("tipos-servicio/");
    return this.http.get<any>(uri + idtiposervicio);
  }

  Insert(nombre: string,
    descripcion: string): Observable<any> {
    const uri = environment.pathServices.concat("tipos-servicio");
    return this.http.post<any>(uri, { nombre, descripcion })
  }

  Update(idtiposervicio: any,
    nombre: string,
    descripcion: string) {
    const uri = environment.pathServices.concat("tipos-servicio");
    return this.http.put<any>(uri, { idtiposervicio, nombre, descripcion });
  }

  Delete(idtiposervicio: any): Observable<string> {
    const uri = environment.pathServices.concat("tipos-servicio/");
    return this.http.delete<any>(uri + idtiposervicio);
  }

}
