import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AddressService } from '../../services/address/address.service';
import { Customer, CustomerAddress } from '../../models/Customer';

@Component({
  selector: 'cm-customer-information-form-container',
  templateUrl: './customer-information-form-container.component.html',
  styleUrls: ['./customer-information-form-container.component.scss']
})
export class CustomerInformationFormContainerComponent implements OnInit {

  @Input() customer: Customer;
  @Output() customerSaved = new EventEmitter<{name: string; email: string; address: CustomerAddress}>();

  name = '';
  email = '';
  address: CustomerAddress = {
    city: '',
    street: '',
    houseNumber: '',
    zipCode: ''
  };
  invalidAddress = false;
  errorMessage = '';

  constructor(private addressService: AddressService) {
  }

  ngOnInit() {
    if (this.customer) {
      this.name = this.customer.name;
      this.email = this.customer.email;
      this.address = this.customer.address;
    }
  }

  onFormSubmit(name: string, email: string, address: CustomerAddress) {
    this.addressService.validateAddress(address).subscribe(validation => {
      this.invalidAddress = !validation.valid;
      this.errorMessage = validation.errorMessage;

      if (validation.valid) {
        this.customerSaved.emit({name, email, address});
      }
    });
  }
}
