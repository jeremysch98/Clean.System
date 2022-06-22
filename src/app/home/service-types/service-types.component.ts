import { Component, OnInit } from '@angular/core';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from "sweetalert2";
import { Router } from '@angular/router';

//services
import { ServiceTypesService } from 'src/app/core/services/home/service-types.service';

@Component({
  selector: 'app-service-types',
  templateUrl: './service-types.component.html',
  styleUrls: ['./service-types.component.css']
})
export class ServiceTypesComponent implements OnInit {
  title_navbar: string = "Tipos de Servicios"
  title_table: string = "Tabla - Tipos de Servicios"

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
  service_types: any = [];
  nombre: string = "";
  descripcion: string = "";
  idtiposervicio: string = "";

  constructor(private router: Router,
    private modalServices: NgbModal,
    private serviceTypesService: ServiceTypesService) { }

  ngOnInit(): void {
    this.ListServiceTypes();
  }

  ShowModal(state: string, modaladd: any, idtiposervicio?: any) {
    if (state == "update") {
      this.modalTitle = "Editar tipo de servicio"
      this.serviceTypesService.GetById(idtiposervicio).subscribe(r => {
        this.checkedValue = idtiposervicio;
        this.nombre = r.response.nombre;
        this.descripcion = r.response.descripcion;
      });
    } else {
      this.modalTitle = "Agregar tipo de servicio"
    }
    this.stateForm = state;
    this.modalServices.open(modaladd, { centered: true, size: 'md' });
  }

  CloseModal() {
    this.modalServices.dismissAll();
    this.nombre = "";
    this.descripcion = "";
  }

  ListServiceTypes() {
    this.serviceTypesService.Get().subscribe(r => {
      this.service_types = r.response;
      this.totalRecords = r.response.length;
    });
  }

  SaveServiceType(addForm: any) {
    if (this.stateForm == "create") {
      if (this.nombre.length == 0 || this.descripcion.length == 0) {
        Swal.fire("", "Complete los campos necesarios. ", "warning");
      } else {
        this.serviceTypesService.Insert(this.nombre, this.descripcion).subscribe(r => {
          if (r.message) {
            this.ListServiceTypes();
            this.modalServices.dismissAll();
            this.nombre = "";
            this.descripcion = "";
            Swal.fire("", r.message, "success");
          }
        });
      }
    }
    if (this.stateForm == "update") {
      this.serviceTypesService.Update(this.checkedValue, this.nombre, this.descripcion).subscribe(r => {
        if (r.message) {
          this.ListServiceTypes();
          this.modalServices.dismissAll();
          this.nombre = "";
          this.descripcion = "";
          Swal.fire("", r.message, "success");
        }
      });
    }
  }

  DeleteServiceType(idtiposervicio: any) {
    Swal.fire({
      text: "¿Esta seguro de eliminar el servicio seleccionado?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
    }).then(result => {
      if (result.isConfirmed) {
        this.serviceTypesService.Delete(idtiposervicio).subscribe(r => {
          if (!r) {
            Swal.fire("", "Este tipo de servicio está en uso, no puede eliminarse.", "warning");
          } else {
            this.ListServiceTypes();
            Swal.fire("", "Tipo de servicio eliminado correctamente.", "success");
          }
        });
      }
    });
  }

}
