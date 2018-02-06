import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Customer } from '../../shared/models/Customer';

@Component({
  selector: 'cm-customer-info',
  templateUrl: './customer-info.component.html',
  styleUrls: ['./customer-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerInfoComponent {

  @Input() customer: Customer;

}
