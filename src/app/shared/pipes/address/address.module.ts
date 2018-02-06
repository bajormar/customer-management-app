import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddressPipe } from './address.pipe';
import { AddressServiceModule } from '../../services/address/address.module';

@NgModule({
  imports: [
    CommonModule,
    AddressServiceModule
  ],
  declarations: [
    AddressPipe
  ],
  exports: [
    AddressPipe
  ]
})
export class AddressPipeModule { }
