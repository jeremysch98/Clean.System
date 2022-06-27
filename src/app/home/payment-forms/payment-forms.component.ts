import { Component, OnInit } from '@angular/core';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from "sweetalert2";
import { Router } from '@angular/router';

//services
import { PaymentFormsService } from 'src/app/core/services/home/payment-forms.service';

@Component({
  selector: 'app-payment-forms',
  templateUrl: './payment-forms.component.html',
  styleUrls: ['./payment-forms.component.css']
})
export class PaymentFormsComponent implements OnInit {
  title_navbar: string = "Formas de Pago"
  title_table: string = "Tabla - Formas de Pago"

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
  payment_forms: any = [];
  idFormaPago: string = "";
  nombre: string = "";

  constructor(private router: Router,
    private modalServices: NgbModal,
    private paymentFormsService: PaymentFormsService,) { }

  ngOnInit(): void {
    this.ListPaymentForms();
  }

  ShowModal(state: string, modaladd: any, idformapago?: any) {
    if (state == "update") {
      this.modalTitle = "Editar forma de pago"
      this.paymentFormsService.GetById(idformapago).subscribe(r => {
        this.checkedValue = idformapago;
        this.nombre = r.response.nombre;
      });
    } else {
      this.modalTitle = "Agregar forma de pago"
    }
    this.stateForm = state;
    this.modalServices.open(modaladd, { centered: true, size: 'md' });
  }

  CloseModal() {
    this.modalServices.dismissAll();
    this.nombre = "";
  }

  ListPaymentForms() {
    this.paymentFormsService.Get().subscribe(r => {
      this.payment_forms = r.response;
      this.totalRecords = r.response.length;
    });
  }

  SavePaymentForm(addForm: any) {
    if (this.stateForm == "create") {
      if (this.nombre.length == 0) {
        Swal.fire("", "Complete los campos necesarios. ", "warning");
      } else {
        this.paymentFormsService.Insert(this.nombre).subscribe(r => {
          if (r.message) {
            this.ListPaymentForms();
            this.modalServices.dismissAll();
            this.nombre = "";
            Swal.fire("", r.message, "success");
          }
        });
      }
    }
    if (this.stateForm == "update") {
      this.paymentFormsService.Update(this.checkedValue, this.nombre ).subscribe(r => {
        if (r.message) {
          this.ListPaymentForms();
          this.modalServices.dismissAll();
          this.nombre = "";
          Swal.fire("", r.message, "success");
        }
      });
    }
  }

  DeletePaymentForm(idformapago: any) {
    Swal.fire({
      text: "¿Esta seguro de eliminar el servicio seleccionado?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
    }).then(result => {
      if (result.isConfirmed) {
        this.paymentFormsService.Delete(idformapago).subscribe(r => {
          if (!r) {
            Swal.fire("", "Este tipo de servicio está en uso, no puede eliminarse.", "warning");
          } else {
            this.ListPaymentForms();
            Swal.fire("", "Tipo de servicio eliminado correctamente.", "success");
          }
        });
      }
    });
  }

}
