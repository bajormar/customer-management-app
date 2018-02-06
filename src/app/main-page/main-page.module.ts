import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MainPageComponent } from './main-page.component';
import { CustomersListComponent } from './customers-list/customers-list.component';
import { CustomerServiceModule } from '../shared/services/customer/customer.module';
import { RouterModule } from '@angular/router';
import { AddressServiceModule } from '../shared/services/address/address.module';
import { CustomerInformationFormContainerModule } from '../shared/components/customer-information-form-container/customer-information-form-container.module';
import { AddressPipeModule } from '../shared/pipes/address/address.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CustomerServiceModule,
    AddressServiceModule,
    RouterModule,
    CustomerInformationFormContainerModule,
    AddressPipeModule
  ],
  declarations: [
    MainPageComponent,
    CustomersListComponent
  ]
})
export class MainPageModule { }
