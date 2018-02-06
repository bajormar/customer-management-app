import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailsPageComponent } from './details-page.component';
import { RouterModule } from '@angular/router';
import { CustomerServiceModule } from '../shared/services/customer/customer.module';
import { CustomerInformationFormContainerModule } from '../shared/components/customer-information-form-container/customer-information-form-container.module';
import { AddressPipeModule } from '../shared/pipes/address/address.module';
import { CustomerInfoComponent } from './customer-info/customer-info.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    CustomerServiceModule,
    CustomerInformationFormContainerModule,
    AddressPipeModule
  ],
  declarations: [
    DetailsPageComponent,
    CustomerInfoComponent
  ]
})
export class DetailsPageModule {
}
