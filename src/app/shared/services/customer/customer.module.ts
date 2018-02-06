import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CustomerService } from './customer.service';

@NgModule({
  imports: [
    HttpClientModule
  ],
  providers: [
    CustomerService
  ]
})
export class CustomerServiceModule {
}
