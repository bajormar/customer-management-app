import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerInformationFormContainerComponent } from './customer-information-form-container.component';
import { FormsModule } from '@angular/forms';
import { CustomerInformationFormComponent } from './customer-information-form/customer-information-form.component';
import { AddressServiceModule } from '../../services/address/address.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AddressServiceModule
  ],
  declarations: [
    CustomerInformationFormContainerComponent,
    CustomerInformationFormComponent
  ],
  exports: [
    CustomerInformationFormContainerComponent
  ]
})
export class CustomerInformationFormContainerModule {
}
