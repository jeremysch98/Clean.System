import { Component, OnInit } from '@angular/core';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from "sweetalert2";
import { Router } from '@angular/router';
import { ProductsService } from 'src/app/core/services/home/products.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  title_navbar: string = "Productos"

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
  products: any = [];
  _id: string = ""
  imagenUrl: string = "";
  tipo: string = "";
  dia: string = "";
  nombre: string = "";
  descripcion: string = "";
  precio: string = "";
  cantidadDisponible: string = "";
  calorias: string = "";
  carbohidratos: string = "";
  proteinas: string = "";
  grasas: string = "";
  peso: string = "";

  /* rows = [
    { name: 'Austin', gender: 'Male', company: 'Swimlane' },
    { name: 'Dany', gender: 'Male', company: 'KFC' },
    { name: 'Molly', gender: 'Female', company: 'Burger King' }
  ];
  columns = [{ prop: 'tipo' }, { name: 'nombre' }, { name: 'calorias' }]; */

  constructor(private router: Router,
    private modalServices: NgbModal,
    private productsService: ProductsService) {
  }

  ngOnInit(): void {
    this.ListProducts();
  }

  ShowModal(state: string, modaladd: any, _id?: string) {
    if (state == "update") {
      /* if (this.checkedValue != "") { */
      this.modalTitle = "Editar producto"
      console.log(_id);
      this.productsService.GetById(_id).subscribe(r => {
        this.checkedValue = r._id;
        this.imagenUrl = r.imagenUrl;
        this.tipo = r.tipo;
        this.dia = r.dia;
        this.nombre = r.nombre;
        this.descripcion = r.descripcion;
        this.precio = r.precio;
        this.cantidadDisponible = r.cantidadDisponible;
        this.calorias = r.calorias;
        this.carbohidratos = r.carbohidratos;
        this.proteinas = r.proteinas;
        this.grasas = r.grasas;
        this.peso = r.peso;
      })
      /* } else {
        Swal.fire("", "Seleccione un registro.", "warning");
      } */
    } else {
      this.modalTitle = "Agregar producto"
    }
    this.stateForm = state;
    this.modalServices.open(modaladd, { centered: true, size: 'md' });
  }

  /* SelectRow(row: any) {
    this.products = row;
  } */

  ListProducts() {
    this.productsService.Get().subscribe(r => {
      this.products = r;
      this.totalRecords = r.length;
    });
  }

  SaveProduct(addForm: any) {
    if (this.stateForm == "create") {
      if (this.imagenUrl.length == 0 || this.tipo.length == 0 || this.dia.length == 0 ||
        this.nombre.length == 0 || this.descripcion.length == 0 || this.precio.length == 0 ||
        this.cantidadDisponible.length == 0 || this.calorias.length == 0 || this.carbohidratos.length == 0 ||
        this.proteinas.length == 0 || this.grasas.length == 0 || this.peso.length == 0) {
        Swal.fire("", "Complete los campos necesarios. ", "warning");
      } else {
        this.productsService.Insert(this.imagenUrl, this.tipo, this.dia, this.nombre, this.descripcion, this.precio, this.cantidadDisponible, this.calorias, this.carbohidratos, this.proteinas, this.grasas, this.peso).subscribe(r => {
          if (r.message) {
            this.ListProducts();
            Swal.fire("", "Producto registrado correctamente.", "success");
          }
        });
      }
    }
    if (this.stateForm == "update") {
      this.productsService.Update(this.checkedValue, this.imagenUrl, this.tipo, this.dia, this.nombre, this.descripcion, this.precio, this.cantidadDisponible, this.calorias, this.carbohidratos, this.proteinas, this.grasas, this.peso).subscribe(r => {
        if(r.message) {
          this.ListProducts();
          Swal.fire("", r.message, "success");
        }
      });
    }
    this.modalServices.dismissAll();
    this.imagenUrl = "";
    this.tipo = "";
    this.dia = "";
    this.nombre = "";
    this.descripcion = "";
    this.precio = "";
    this.cantidadDisponible = "";
    this.calorias = "";
    this.carbohidratos = "";
    this.proteinas = "";
    this.grasas = "";
    this.peso = "";
  }

  DeleteProduct(_id: string) {
    Swal.fire({
      text: "¿Esta seguro de eliminar el producto seleccionado?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
    }).then(result => {
      if (result.isConfirmed) {
        this.productsService.Delete(_id).subscribe(r => {
          if (r) {
            this.ListProducts();
            Swal.fire("", "Producto eliminado correctamente.", "success");
          }
        });
      }
    });
  }
}
