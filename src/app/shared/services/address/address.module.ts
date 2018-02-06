import { NgModule } from '@angular/core';
import { AddressService } from './address.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    HttpClientModule
  ],
  providers: [
    AddressService
  ]
})
export class AddressServiceModule { }
