import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Customer, CustomerAddress, CustomerDTO } from '../../models/Customer';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export const STRIPE_CUSTOMER_API_URL = 'https://api.stripe.com/v1/customers';
const headers = {
  'Authorization': `Bearer ${environment.STRIPE_API_KEY}`,
  'Content-Type': 'application/x-www-form-urlencoded'
};

@Injectable()
export class CustomerService {

  private stateSubject = new BehaviorSubject({
    customers: [] as Customer[],
    hasMore: false
  });

  readonly state$ = this.stateSubject.asObservable();

  constructor(private httpClient: HttpClient) {
  }

  loadCustomers(): void {
    if (this.stateSubject.getValue().customers.length > 0) {
      return;
    }

    this.httpClient
      .get<{ data: CustomerDTO[], has_more: boolean }>(STRIPE_CUSTOMER_API_URL, {headers})
      .subscribe(response => {
        this.stateSubject.next({
          customers: response.data.map(this.transformToCustomer),
          hasMore: response.has_more
        });
      });
  }

  loadMoreCustomers(): void {
    const state = this.stateSubject.getValue();
    const lastCustomerId = state.customers[state.customers.length - 1].id;
    const params = new HttpParams().set('starting_after', lastCustomerId);

    this.httpClient
      .get<{ data: CustomerDTO[], has_more: boolean }>(STRIPE_CUSTOMER_API_URL, {headers, params})
      .subscribe(response => {
        const customers = response.data.map(this.transformToCustomer);
        this.stateSubject.next({
          customers: [...state.customers, ...customers],
          hasMore: response.has_more
        });
      });
  }

  getCustomer(customerId: string): Observable<Customer> {
    return this.httpClient
      .get<CustomerDTO>(`${STRIPE_CUSTOMER_API_URL}/${customerId}`, {headers})
      .pipe(
        map(this.transformToCustomer),
      );
  }

  saveCustomer(name: string, email: string, address: CustomerAddress): void {
    const params = this.createHttpParamsForCustomerSave(name, email, address);

    this.httpClient
      .post<CustomerDTO>(STRIPE_CUSTOMER_API_URL, null, {headers, params})
      .pipe(
        map(this.transformToCustomer),
      )
      .subscribe(response => {
        const state = this.stateSubject.getValue();
        this.stateSubject.next({
          ...state,
          customers: [...state.customers, response]
        });
      });
  }

  deleteCustomer(customerId: string): void {
    this.httpClient
      .delete<any>(`${STRIPE_CUSTOMER_API_URL}/${customerId}`, {headers})
      .subscribe(() => {
        const state = this.stateSubject.getValue();
        this.stateSubject.next({
          ...state,
          customers: state.customers.filter(item => item.id !== customerId)
        });
      });
  }

  updateCustomer(customerId: string, name: string, email: string, address: CustomerAddress): Observable<Customer> {
    const params = this.createHttpParamsForCustomerSave(name, email, address);

    return this.httpClient
      .post<CustomerDTO>(`${STRIPE_CUSTOMER_API_URL}/${customerId}`, null, {headers, params})
      .pipe(
        map(this.transformToCustomer),
        tap(customer => {
          const state = this.stateSubject.getValue();
          this.stateSubject.next({
            ...state,
            customers: [customer, ...state.customers.filter(item => item.id !== customerId)]
          });
        })
      );
  }

  private transformToCustomer(customerDto: CustomerDTO): Customer {
    return {
      id: customerDto.id,
      name: customerDto.metadata.name,
      email: customerDto.email,
      address: {
        city: customerDto.metadata.address_city,
        street: customerDto.metadata.address_street,
        houseNumber: customerDto.metadata.address_houseNumber,
        zipCode: customerDto.metadata.address_zipCode,
      }
    };
  }

  private createHttpParamsForCustomerSave(name: string, email: string, address: CustomerAddress): HttpParams {
    return new HttpParams()
      .set('email', email)
      .set('metadata[name]', name)
      .set('metadata[address_city]', address.city)
      .set('metadata[address_street]', address.street)
      .set('metadata[address_houseNumber]', address.houseNumber)
      .set('metadata[address_zipCode]', address.zipCode);
  }
}
