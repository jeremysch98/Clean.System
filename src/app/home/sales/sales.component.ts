import { Component, OnInit } from '@angular/core';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import Swal from "sweetalert2";
import { Router } from '@angular/router';
import { HtmlToExcel } from "src/app/shared/util/HtmlToExcel";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

//services
import { OrderService } from 'src/app/core/services/home/order.service';
import { ClientsService } from 'src/app/core/services/home/clients.service';
import { StatusOrderService } from 'src/app/core/services/home/status-order.service';
import { UsersService } from 'src/app/core/services/home/users.service';
import { ServicesService } from 'src/app/core/services/home/services.service';
import { OrderDetailsService } from 'src/app/core/services/home/order-details.service';
import { PaymentFormsService } from 'src/app/core/services/home/payment-forms.service';
import { PaymentService } from 'src/app/core/services/home/payment.service';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css'],
  providers: [DatePipe]
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
  HtmlToExcel: HtmlToExcel = new HtmlToExcel()
  public readonly pageLimitOptions = [{ value: 5 }, { value: 7 }];

  /*order detail*/
  order_detail_title: string = "";
  hiddenInput: boolean = false;
  hiddenTableDetallePedido: boolean = false;
  hiddenControls: boolean = true;
  hiddenButton: boolean = true;
  hiddenButtonAdd: boolean = true;
  hiddenButtonConfirm: boolean = true;

  /* payment detail */
  subTotal: number = 0;
  IGV: number = 0;
  total: number = 0;

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

  //PAGO INICIO
  payment_forms: any = [];
  idFormaPago: any;
  boleta: any = [];
  //PAGO FIN

  //BOLETA INICIO
  hiddenBoleta: boolean = false
  idOrderInvoice: any = "";
  //BOLETA FIN

  constructor(private router: Router,
    private modalServices: NgbModal,
    private datePipe: DatePipe,
    private orderService: OrderService,
    private clientsService: ClientsService,
    private statusOrderService: StatusOrderService,
    private usersService: UsersService,
    private servicesService: ServicesService,
    private orderDetailsService: OrderDetailsService,
    private paymentFormsService: PaymentFormsService,
    private paymentService: PaymentService) { }

  ngOnInit(): void {
    this.ValidateRedirect();
    this.ListOrders();
    this.ListStausesOrder();
    this.ListServices();
    this.ListPaymentForm();
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
    this.order_details = [];
    this.subTotal = 0;
    this.total = 0;
    this.IGV = 0;
    this.idFormaPago = "";
    this.hiddenControls = true;
    this.hiddenButton = true;
    this.hiddenButtonAdd = true;
    this.hiddenButtonConfirm = true;
    this.boleta = []
  }

  DownloadOrders() {
    let sBody: string = "";
		let index: number = 0;
		sBody += "<tr>";
		sBody += "<th>COD PEDIDO</th>";
		sBody += "<th>FECHA INGRESO</th>";
		sBody += "<th>FECHA SALIDA</th>";
    sBody += "<th>DNI CLIENTE</th>";
    sBody += "<th>NOMBRE CLIENTE</th>";
    sBody += "<th>USUARIO</th>";
    sBody += "<th>ESTADO</th>";
    sBody += "</tr>";
		this.orders.forEach((l, i) => {
			index++;
			sBody += "<tr>";
			sBody += "<td>" + l.idpedido + "</td>";
			sBody += "<td>" + l.fechaingreso + "</td>";
			sBody += "<td>" + l.fechasalida + "</td>";
      sBody += "<td>" + l.dnicliente + "</td>";
      sBody += "<td>" + l.nombrecliente + "</td>";
      sBody += "<td>" + l.oUsuario.nombre + " " + l.oUsuario.apellido + "</td>";
      sBody += "<td>" + l.oEstadoPedido.nombre + "</td>";
			sBody += "</tr>";
		});
		this.HtmlToExcel.ExportTOExcel("TableExport", sBody, ("Pedidos").concat(" ", this.datePipe.transform(new Date(), 'ddMMyyyy')), "Pedidos", "xlsx");
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
        this.hiddenControls = false;
        this.hiddenButtonAdd = false
        this.hiddenButtonConfirm = false;
        if (this.idEstadoPedido == 1 || this.idEstadoPedido == 4 || this.idEstadoPedido == null) {
          this.hiddenButton = true;
        } else {
          this.hiddenButton = false;
        }
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

  SeeInvoice(idPedido: any) {
    this.idOrderInvoice = idPedido;
    this.mainTableOrders = false;
    this.hiddenBoleta = true;
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
        this.nombreServicio = r.response.nombre;
        this.precioServicio = r.response.precio;
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
      for (let st in this.order_details) {
        this.subTotal += (this.order_details[st].precio * this.order_details[st].cantidad);
      }
      this.ListBoleta();
      this.IGV = this.subTotal * 0.18;
      this.total = this.subTotal * 1.18;
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
            this.subTotal = 0;
            this.total = 0;
            this.ListOrderDetails();
            this.modalServices.dismissAll();
            this.idServicio = "";
            this.nombreServicio = "";
            this.precioServicio = "";
            this.cantidad = "";
            this.observacion = "";
            /* this.order_details = []; */
            Swal.fire("", r.message, "success");
          }
        })
      }
    }
    if (this.stateFormSub == "update") {
      console.log(this.checkedValueSub);
      this.orderDetailsService.Update(this.checkedValueSub, this.idServicio, this.checkedValue, this.nombreServicio, this.precioServicio, this.cantidad, this.observacion).subscribe(r => {
        if (r.message) {
          this.subTotal = 0;
          this.total = 0;
          this.ListOrderDetails();
          this.modalServices.dismissAll();
          this.idServicio = "";
          this.nombreServicio = "";
          this.precioServicio = "";
          this.cantidad = "";
          this.observacion = "";
          /* this.order_details = []; */
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
            this.subTotal = 0;
            this.total = 0;
            this.ListOrderDetails();
            Swal.fire("", "Detalle eliminado correctamente.", "success");
          }
        });
      }
    });
  }

  ListPaymentForm() {
    this.paymentFormsService.Get().subscribe(r => {
      this.payment_forms = r.response;
      console.log(r.response)
    });
  }

  ListBoleta() {
    this.paymentService.GetByIdPedido(this.checkedValue).subscribe(r => {
      this.boleta = r.response;
      this.idFormaPago = this.boleta[0].idformapago;
    });
  }

  ConfirmOrder(confirmForm: any) {
    if (this.idFormaPago == null) {
      Swal.fire("", "Seleccione una forma de pago.", "warning");
    } else {
      this.paymentService.Insert(this.fechaIngreso, this.subTotal, this.IGV, this.total, this.idFormaPago, this.checkedValue).subscribe(r => {
        if (r.message) {
          this.hiddenButton = false
          this.hiddenControls = false;
          this.hiddenButtonAdd = false;
          Swal.fire("", "El pedido se ha confirmado correctamente.", "success");
          console.log("Exportando boleta...")
        }
      });
    }
  }

}
