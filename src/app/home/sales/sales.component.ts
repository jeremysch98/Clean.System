import { Component, OnInit } from '@angular/core';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import Swal from "sweetalert2";
import { Router } from '@angular/router';

//services
import { OrderService } from 'src/app/core/services/home/order.service';
import { ClientsService } from 'src/app/core/services/home/clients.service';
import { StatusOrderService } from 'src/app/core/services/home/status-order.service';
import { UsersService } from 'src/app/core/services/home/users.service';
import { ServicesService } from 'src/app/core/services/home/services.service';
import { OrderDetailsService } from 'src/app/core/services/home/order-details.service';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css']
})
export class SalesComponent implements OnInit {
  title_navbar: string = "Pedidos"

  //INICIO MAIN
  /*main table orders*/
  title_table: string = "Tabla - Pedidos"
  checkedValue: any;
  stateForm: string = "";
  gridFilter: string = "";
  ColumnMode = ColumnMode;
  gridLimit: number = 5;
  page_size: number = 5;
  page_number: number = 1;
  totalRecords: any;
  mainTableOrders: boolean = true;
  public readonly pageLimitOptions = [{ value: 5 }, { value: 7 }];

  /*order detail*/
  order_detail_title: string = "";
  hiddenInput: boolean = false;
  hiddenTableDetallePedido: boolean = false;

  /*variables*/
  orders: any = [];
  orderIdTemp: number = 0
  status_order: any = [];
  idPedido: string = "";
  fechaIngreso: any;
  fechaSalida: any;
  dniCliente: string = "";
  nombreCliente: string = "";
  idEstadoPedido: any;
  idUsuario: any = localStorage.getItem('id');
  nombreUsuario: string = "";
  //FIN MAIN

  //INICIO SUB
  /*sub table*/
  title_table_sub: string = "Detalle del pedido"
  checkedValueSub: any;
  stateFormSub: string = "";
  gridFilterSub: string = "";
  ColumnModeSub = ColumnMode;
  gridLimitSub: number = 5;
  page_sizeSub: number = 5;
  page_numberSub: number = 1;
  totalRecordsSub: any;
  subOrderDetails: boolean = false;

  /*sub*/
  public modalTitleSub: string = "";

  /*variables*/
  order_details: any = [];
  services: any = [];
  idServicio: string = "";
  nombreServicio: string = "";
  precioServicio: any;
  cantidad: any;
  observacion: string = "";
  //FIN SUB

  constructor(private router: Router,
    private modalServices: NgbModal,
    private datePipe: DatePipe,
    private orderService: OrderService,
    private clientsService: ClientsService,
    private statusOrderService: StatusOrderService,
    private usersService: UsersService,
    private servicesService: ServicesService,
    private orderDetailsService: OrderDetailsService) { }

  ngOnInit(): void {
    this.ValidateRedirect();
    this.ListOrders();
    this.ListStausesOrder();
    this.ListServices();
  }

  ValidateRedirect() {
    if (localStorage.getItem('id') == null) {
      this.router.navigate(["auth/login"]);
    }
  }

  SearchClient(dniCliente: any) {
    if (this.dniCliente.length == 0) {
      Swal.fire("", "Ingresar un DNI. ", "warning");
    } else {
      this.clientsService.GetByDNI(dniCliente).subscribe(r => {
        if (r.success) {
          this.nombreCliente = r.data.nombre_completo;
        } else {
          Swal.fire("", "DNI no encontrado. ", "info");
        }
      });
    }
  }

  ReturnMainTableOrders() {
    this.subOrderDetails = false;
    this.mainTableOrders = true;
    this.ListOrders();
    this.hiddenInput = false;
    this.hiddenTableDetallePedido = false;
    this.fechaIngreso = "";
    this.fechaSalida = "";
    this.dniCliente = "";
    this.nombreCliente = "";
    this.idEstadoPedido = "";
    this.idUsuario = localStorage.getItem('id');
    this.nombreUsuario = "";
    this.idServicio = "";
    this.nombreServicio = "";
    this.precioServicio = "";
    this.cantidad = "";
    this.observacion = "";
  }

  ShowSubOrderDetails(state: string, idPedido?: any) {
    if (state == "update") {
      this.order_detail_title = "Editar pedido"
      this.checkedValue = idPedido;
      this.orderService.GetById(idPedido).subscribe(r => {
        this.orderIdTemp = r.response.idpedido;
        this.fechaIngreso = r.response.fechaingreso;
        this.fechaSalida = r.response.fechasalida;
        this.dniCliente = r.response.dnicliente;
        this.nombreCliente = r.response.nombrecliente;
        this.idEstadoPedido = r.response.idestadopedido;
        this.idUsuario = r.response.idusuario;
        this.nombreUsuario = r.response.oUsuario.nombre + " " + r.response.oUsuario.apellido;
      });
      this.hiddenTableDetallePedido = true;
      this.hiddenInput = true;
      this.ListOrderDetails();
    } else {
      this.order_detail_title = "Agregar pedido"
      this.CountRows();
      this.fechaIngreso = new Date();
      this.ListUserByID();
    }
    this.stateForm = state;
    this.subOrderDetails = true;
    this.mainTableOrders = false;
  }

  ListUserByID() {
    this.usersService.GetById(localStorage.getItem('id')).subscribe(r => {
      this.nombreUsuario = r.response.nombre + " " + r.response.apellido;
    });
  }

  SaveOrder(addForm: any) {
    if (this.stateForm == "create") {
      if (this.dniCliente.length == 0 || this.nombreCliente.length == 0 ||
        this.idEstadoPedido == null) {
        Swal.fire("", "Complete los campos necesarios. ", "warning");
      } else {
        this.orderService.Insert(this.fechaIngreso, this.fechaSalida, this.dniCliente, this.nombreCliente, this.idEstadoPedido, this.idUsuario).subscribe(r => {
          if (r.message) {
            this.ListOrders();
            /*this.fechaIngreso = "";
            this.fechaSalida = "";
            this.dniCliente = "";
            this.nombreCliente = "";
            this.idEstadoPedido = "";
            this.idUsuario = localStorage.getItem('id');
            this.nombreUsuario = ""; */
            this.hiddenTableDetallePedido = true;
            Swal.fire("", r.message, "success");
          }
        });
      }
    }
    if (this.stateForm == "update") {
      this.orderService.Update(this.checkedValue, this.fechaIngreso, this.fechaSalida, this.dniCliente, this.nombreCliente, this.idEstadoPedido, this.idUsuario).subscribe(r => {
        if (r.message) {
          this.ListOrders();
          /* this.fechaIngreso = "";
          this.fechaSalida = "";
          this.dniCliente = "";
          this.nombreCliente = "";
          this.idEstadoPedido = "";
          this.idUsuario = localStorage.getItem('id');;
          this.nombreUsuario = ""; */
          Swal.fire("", r.message, "success");
        }
      });
    }
  }

  ShowDetailOrderModal(statesub: string, modaladdsub: any, iddetalle?: any) {
    if (statesub == "update") {
      this.modalTitleSub = "Editar detalle"
      this.orderDetailsService.GetById(iddetalle).subscribe(r => {
        this.checkedValueSub = iddetalle;
        this.idServicio = r.response.idservicio;
        this.nombreServicio = r.response.oServicio.nombre;
        this.precioServicio = r.response.oServicio.precio;
        this.cantidad = r.response.cantidad;
        this.observacion = r.response.observacion;
      });
    } else {
      this.modalTitleSub = "Agregar detalle"
      this.checkedValue = this.orderIdTemp;
    }
    this.stateFormSub = statesub;
    this.modalServices.open(modaladdsub, { centered: true, size: 'md' });
  }

  CloseModal() {
    this.modalServices.dismissAll();
    this.idServicio = "";
    this.nombreServicio = "";
    this.precioServicio = "";
    this.cantidad = "";
    this.observacion = "";
  }

  CountRows() {
    this.orderService.GetRowOrder().subscribe(r => {
      if (!r.response) {
        this.orderIdTemp = 100001
      } else {
        this.orderIdTemp = r.response;
      }
    })
  }

  ListOrders() {
    this.orderService.Get().subscribe(r => {
      this.orders = r.response;
      this.totalRecords = r.response.length;
    })
  }

  ListStausesOrder() {
    this.statusOrderService.Get().subscribe(r => {
      this.status_order = r.response;
    })
  }

  ListServices() {
    this.servicesService.Get().subscribe(r => {
      this.services = r.response;
    });
  }

  ListOrderDetails() {
    this.orderDetailsService.Get(this.checkedValue).subscribe(r => {
      this.order_details = r.response;
      this.totalRecordsSub = r.response.length;
    });
  }

  onSelectService(idServicio: any) {
    this.servicesService.GetById(idServicio).subscribe(r => {
      this.nombreServicio = r.response.nombre;
      this.precioServicio = r.response.precio;
    });
  }

  SaveOrderDetail(addFormSub: any) {
    if (this.stateFormSub == "create") {
      if (this.nombreServicio.length == 0 || this.cantidad == null ||
        this.observacion.length == 0) {
        Swal.fire("", "Complete los campos necesarios. ", "warning");
      } else {
        this.orderDetailsService.Insert(this.idServicio, this.checkedValue, this.nombreServicio, this.precioServicio, this.cantidad, this.observacion).subscribe(r => {
          if (r.message) {
            this.ListOrderDetails();
            this.modalServices.dismissAll();
            this.idServicio = "";
            this.nombreServicio = "";
            this.precioServicio = "";
            this.cantidad = "";
            this.observacion = "";
            Swal.fire("", r.message, "success");
          }
        })
      }
    }
    if (this.stateForm == "update") {
      this.orderDetailsService.Update(this.checkedValueSub, this.idServicio, this.checkedValue, this.nombreCliente, this.precioServicio, this.cantidad, this.observacion).subscribe(r => {
        if (r.message) {
          this.ListOrderDetails();
          this.modalServices.dismissAll();
          this.idServicio = "";
          this.nombreServicio = "";
          this.precioServicio = "";
          this.cantidad = "";
          this.observacion = "";
          Swal.fire("", r.message, "success");
        }
      })
    }
  }

  DeleteOrderDetail(iddetallepedido: any) {
    Swal.fire({
      text: "¿Esta seguro de eliminar el detalle seleccionado?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
    }).then(result => {
      if (result.isConfirmed) {
        this.orderDetailsService.Delete(iddetallepedido).subscribe(r => {
          if (r) {
            this.ListOrderDetails();
            Swal.fire("", "Detalle eliminado correctamente.", "success");
          }
        });
      }
    });
  }

}
