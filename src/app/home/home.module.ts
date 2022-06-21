import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HomeRoutingModule } from './home-routing.module';
import { SalesComponent } from './sales/sales.component';
import { ClientsComponent } from './clients/clients.component';
import { ServicesComponent } from './services/services.component';
import { ServiceTypesComponent } from './service-types/service-types.component';
import { UsersComponent } from './users/users.component';
import { ConfigurationsComponent } from './configurations/configurations.component';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { PaginatePipe } from '../pipes/paginate.pipe';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
    PaginatePipe,
    SalesComponent,
    ClientsComponent,
    ServicesComponent,
    ServiceTypesComponent,
    UsersComponent,
    ConfigurationsComponent,
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
