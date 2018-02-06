import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { AddressService } from '../../../services/address/address.service';
import { CustomerAddress } from '../../../models/Customer';

@Component({
  selector: 'cm-customer-information-form',
  templateUrl: './customer-information-form.component.html',
  styleUrls: ['./customer-information-form.component.scss']
})
export class CustomerInformationFormComponent {
  @Input() name: string;
  @Input() email: string;
  @Input() address: CustomerAddress;
  @Input() invalidAddress: boolean;
  @Input() errorMessage: string;
  @Output() formSubmitted = new EventEmitter<{name: string; email: string; address: CustomerAddress}>();
}
