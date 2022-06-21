import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientsComponent } from './clients/clients.component';
import { ConfigurationsComponent } from './configurations/configurations.component';
import { SalesComponent } from './sales/sales.component';
import { ServiceTypesComponent } from './service-types/service-types.component';
import { ServicesComponent } from './services/services.component';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'sales', component: SalesComponent},
      { path: 'clients', component: ClientsComponent},
      { path: 'services', component: ServicesComponent},
      { path: 'service-types', component: ServiceTypesComponent},
      { path: 'users', component: UsersComponent},
      { path: 'configurations', component: ConfigurationsComponent},
      { path: '**', redirectTo: 'sales' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
