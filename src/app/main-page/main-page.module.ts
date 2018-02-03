import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainPageComponent } from './main-page.component';
import { RegistrationFormComponent } from './registration-form/registration-form.component';
import { CustomersListComponent } from './customers-list/customers-list.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [MainPageComponent, RegistrationFormComponent, CustomersListComponent]
})
export class MainPageModule { }
 