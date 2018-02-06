import { Component, OnDestroy, OnInit } from '@angular/core';
import { CustomerService } from '../shared/services/customer/customer.service';
import { Subscription } from 'rxjs/Subscription';
import { Customer, CustomerAddress } from '../shared/models/Customer';

@Component({
  selector: 'cm-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit, OnDestroy {

  customers: Customer[] = [];
  hasMore = false;

  private customerStateSub: Subscription;

  constructor(private customerService: CustomerService) { }

  ngOnInit() {
    this.customerService.loadCustomers();
    this.customerStateSub = this.customerService.state$.subscribe(response => {
      this.customers = response.customers;
      this.hasMore = response.hasMore;
    });
  }


  saveCustomer(name: string, email: string, address: CustomerAddress) {
    this.customerService.saveCustomer(name, email, address);
  }

  deleteCustomer(customerId: string) {
    this.customerService.deleteCustomer(customerId);
  }

  loadMore() {
    this.customerService.loadMoreCustomers();
  }

  ngOnDestroy() {
    if (this.customerStateSub) {
      this.customerStateSub.unsubscribe();
    }
  }
}
