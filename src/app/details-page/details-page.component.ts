import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../shared/services/customer/customer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Customer, CustomerAddress } from '../shared/models/Customer';

@Component({
  selector: 'cm-details-page',
  templateUrl: './details-page.component.html',
  styleUrls: ['./details-page.component.scss']
})
export class DetailsPageComponent implements OnInit {
  customerData: Customer;

  constructor(private customerService: CustomerService,
              private activatedRoute: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      this.customerService.getCustomer(params.get('customerId')).subscribe(customer => {
        this.customerData = customer;
      }, () => {
        this.router.navigate(['']);
      });
    });
  }

  updateCustomer(name: string, email: string, address: CustomerAddress) {
    this.customerService.updateCustomer(this.customerData.id, name, email, address).subscribe(customer => {
      this.customerData = customer;
    });
  }

}
