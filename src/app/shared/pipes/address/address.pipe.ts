import { Pipe, PipeTransform } from '@angular/core';
import { CustomerAddress } from '../../models/Customer';
import { AddressService } from '../../services/address/address.service';

@Pipe({
  name: 'address'
})
export class AddressPipe implements PipeTransform {

  constructor(private addressService: AddressService) {
  }

  transform(address: CustomerAddress): string {
    if (!address) {
      return '';
    }

    return this.addressService.formatAddress(address);
  }

}
