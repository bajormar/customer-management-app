import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Customer } from '../../shared/models/Customer';

@Component({
  selector: 'cm-customers-list',
  templateUrl: './customers-list.component.html',
  styleUrls: ['./customers-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomersListComponent {

  @Input() hasMore = false;
  @Input() customers: Customer[] = [];

  @Output() deleteCustomerClicked = new EventEmitter<string>();
  @Output() loadMoreClicked = new EventEmitter();

  trackByCustomerId(index, customer: Customer) {
    return customer.id;
  }
}
