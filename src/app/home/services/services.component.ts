import { Component, OnInit } from '@angular/core';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from "sweetalert2";
import { Router } from '@angular/router';

//services
import { ServicesService } from 'src/app/core/services/home/services.service';
import { ServiceTypesService } from 'src/app/core/services/home/service-types.service';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {
  title_navbar: string = "Servicios"
  title_table: string = "Tabla - Servicios"

  /*table*/
  checkedValue: any;
  stateForm: string = "";
  gridFilter: string = "";
  ColumnMode = ColumnMode;
  gridLimit: number = 5;
  page_size: number = 5;
  page_number: number = 1;
  totalRecords: any;
  public readonly pageLimitOptions = [{ value: 5 }, { value: 7 }];

  /*modal*/
  modalTitle: string = "";

  /*variables*/
  services: any = [];
  service_types: any = [];
  idServicio: string = "";
  nombre: string = "";
  precio: string = "";
  descripcion: string = "";
  idtiposervicio: string = "";

  constructor(private router: Router,
    private modalServices: NgbModal,
    private servicesService: ServicesService,
    private serviceTypesService: ServiceTypesService) { }

  ngOnInit(): void {
    this.ListServices();
    this.ListServiceTypes();
  }

  ShowModal(state: string, modaladd: any, idservicio?: any) {
    if (state == "update") {
      this.modalTitle = "Editar servicio"
      this.servicesService.GetById(idservicio).subscribe(r => {
        this.checkedValue = idservicio;
        this.nombre = r.response.nombre;
        this.descripcion = r.response.descripcion;
        this.precio = r.response.precio;
        this.idtiposervicio = r.response.idtiposervicio;
      });
    } else {
      this.modalTitle = "Agregar servicio"
    }
    this.stateForm = state;
    this.modalServices.open(modaladd, { centered: true, size: 'md' });
  }

  CloseModal() {
    this.modalServices.dismissAll();
    this.nombre = "";
    this.descripcion = "";
    this.precio = "";
    this.idtiposervicio = "";
  }

  ListServices() {
    this.servicesService.Get().subscribe(r => {
      this.services = r.response;
      this.totalRecords = r.response.length;
    });
  }

  ListServiceTypes() {
    this.serviceTypesService.Get().subscribe(r => {
      this.service_types = r.response;
    });
  }

  SaveService(addForm: any) {
    if (this.stateForm == "create") {
      if (this.nombre.length == 0 || this.precio.length == 0 ||
        this.descripcion.length == 0 || this.idtiposervicio.length == 0) {
        Swal.fire("", "Complete los campos necesarios. ", "warning");
      } else {
        this.servicesService.Insert(this.nombre, this.precio, this.descripcion, this.idtiposervicio).subscribe(r => {
          if (r.message) {
            this.ListServices();
            this.modalServices.dismissAll();
            this.nombre = "";
            this.descripcion = "";
            this.precio = "";
            this.idtiposervicio = "";
            Swal.fire("", r.message, "success");
          }
        });
      }
    }
    if (this.stateForm == "update") {
      this.servicesService.Update(this.checkedValue, this.nombre, this.precio, this.descripcion, this.idtiposervicio).subscribe(r => {
        if (r.message) {
          this.ListServices();
          this.modalServices.dismissAll();
          this.nombre = "";
          this.descripcion = "";
          this.precio = "";
          this.idtiposervicio = "";
          Swal.fire("", r.message, "success");
        }
      });
    }
  }

  DeleteService(idservicio: any) {
    Swal.fire({
      text: "¿Esta seguro de eliminar el servicio seleccionado?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
    }).then(result => {
      if (result.isConfirmed) {
        this.servicesService.Delete(idservicio).subscribe(r => {
          if (r) {
            this.ListServices();
            Swal.fire("", "Servicio eliminado correctamente.", "success");
          }
        });
      }
    });
  }

}
