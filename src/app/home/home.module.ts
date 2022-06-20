import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HomeRoutingModule } from './home-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductsComponent } from './products/products.component';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { PaginatePipe } from '../pipes/paginate.pipe';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
    DashboardComponent,
    ProductsComponent,
    PaginatePipe,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    FormsModule,
    NgxDatatableModule.forRoot({
      messages: {
        emptyMessage: "No hay registros disponibles",
        totalMessage: "# registros",
        selectedMessage: "selected"
      }
    }),
    Ng2SearchPipeModule,
    NgxPaginationModule
  ]
})
export class HomeModule { }
