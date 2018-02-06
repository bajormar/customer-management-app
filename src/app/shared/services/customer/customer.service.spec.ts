import { TestBed } from '@angular/core/testing';

import { CustomerService, STRIPE_CUSTOMER_API_URL } from './customer.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Customer, CustomerAddress, CustomerDTO } from '../../models/Customer';
import { HttpRequest } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

describe('CustomerService', () => {
  let customerService: CustomerService;
  let httpMock: HttpTestingController;

  const customerDTO1: CustomerDTO = {
    id: '1',
    email: 'email@email.com',
    metadata: {
      name: 'Name',
      address_city: 'City',
      address_street: 'Street',
      address_houseNumber: '1',
      address_zipCode: '12345'
    }
  };

  const customerDTO2: CustomerDTO = {
    id: '2',
    email: 'email2@email.com',
    metadata: {
      name: 'Name2',
      address_city: 'City2',
      address_street: 'Street2',
      address_houseNumber: '2',
      address_zipCode: '23456'
    }
  };

  const customer1: Customer = {
    id: '1',
    name: 'Name',
    email: 'email@email.com',
    address: {
      city: 'City',
      street: 'Street',
      houseNumber: '1',
      zipCode: '12345'
    }
  };

  const customer2: Customer = {
    id: '2',
    name: 'Name2',
    email: 'email2@email.com',
    address: {
      city: 'City2',
      street: 'Street2',
      houseNumber: '2',
      zipCode: '23456'
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        CustomerService
      ]
    });
  });

  beforeEach(() => {
    httpMock = TestBed.get(HttpTestingController);
    customerService = TestBed.get(CustomerService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('state$', () => {
    it('should return initial state', () => {
      // When
      customerService.state$.subscribe(state => {
        // Then
        expect(state.customers).toEqual([]);
        expect(state.hasMore).toBe(false);
      });
    });
  });

  describe('loadCustomers', () => {
    it('should replace current state with response data', () => {
      // When
      customerService.loadCustomers();

      expectLoadCustomersResponse().flush({data: [customerDTO1], has_more: true});

      customerService.state$.subscribe(state => {
        // Then
        expect(state.customers).toEqual([customer1]);
        expect(state.hasMore).toBe(true);
      });
    });

    it('should do nothing if already loaded', () => {
      // When
      customerService.loadCustomers();

      expectLoadCustomersResponse().flush({data: [customerDTO1], has_more: false});

      customerService.loadCustomers();
    });
  });

  describe('loadMoreCustomers', () => {
    it('should append loaded customers to current state', () => {
      // When
      customerService.loadCustomers();

      expectLoadCustomersResponse().flush({data: [customerDTO1], has_more: true});

      customerService.loadMoreCustomers();

      expectLoadMoreCustomersResponse().flush({data: [customerDTO2], has_more: false});

      customerService.state$.subscribe(state => {
        // Then
        expect(state.customers).toEqual([customer1, customer2]);
        expect(state.hasMore).toBe(false);
      });
    });
  });

  describe('getCustomer', () => {
    it('should query customer data by customerId', () => {
      // When
      customerService.getCustomer(customer1.id).subscribe(customer => {
        // Then
        expect(customer).toEqual(customer1);
      });

      expectGetCustomerResponse(customer1.id).flush(customerDTO1);
    });
  });

  describe('saveCustomer', () => {
    it('should send save request and append created customer to current customers', () => {
      // When
      customerService.saveCustomer(customer1.name, customer1.email, customer1.address);

      expectSaveCustomerResponse(customer1.name, customer1.email, customer1.address).flush(customerDTO1);

      customerService.state$.subscribe(state => {
        // Then
        expect(state.customers).toEqual([customer1]);
        expect(state.hasMore).toBe(false);
      });
    });
  });

  describe('deleteCustomer', () => {
    it('should send delete request and remove customer from current state', () => {
      // Given
      customerService.loadCustomers();
      expectLoadCustomersResponse().flush({data: [customerDTO2], has_more: false});

      // When
      customerService.deleteCustomer(customer2.id);

      expectDeleteCustomerResponse(customer2.id).flush({});

      customerService.state$.subscribe(state => {
        // Then
        expect(state.customers).toEqual([]);
        expect(state.hasMore).toBe(false);
      });
    });
  });

  describe('updateCustomer', () => {
    it('should send update request and update customer information in current customers', () => {
      // Given
      customerService.loadCustomers();
      expectLoadCustomersResponse().flush({data: [customerDTO2], has_more: false});

      // When
      customerService.updateCustomer(customer2.id, customer2.name, customer2.email, customer2.address).subscribe();

      expectUpdateCustomerResponse(customer2.id, customer2.name, customer2.email, customer2.address).flush(customerDTO2);

      customerService.state$.subscribe(state => {
        // Then
        expect(state.customers).toEqual([customer2]);
        expect(state.hasMore).toBe(false);
      });
    });
  });

  function expectLoadCustomersResponse() {
    return httpMock.expectOne(req => {
      return req.method === 'GET' &&
        req.url === STRIPE_CUSTOMER_API_URL &&
        hasAuthorizationHeaders(req);
    });
  }

  function expectLoadMoreCustomersResponse() {
    return httpMock.expectOne(req => {
      return req.method === 'GET' &&
        req.url === STRIPE_CUSTOMER_API_URL &&
        hasAuthorizationHeaders(req);
    });
  }

  function expectGetCustomerResponse(customerId: string) {
    return httpMock.expectOne(req => {
      return req.method === 'GET' &&
        req.url === `${STRIPE_CUSTOMER_API_URL}/${customerId}` &&
        hasAuthorizationHeaders(req);
    });
  }

  function expectSaveCustomerResponse(name: string, email: string, address: CustomerAddress) {
    return httpMock.expectOne(req => {
      return req.method === 'POST' &&
        req.url === STRIPE_CUSTOMER_API_URL &&
        hasCustomerInfoParams(req, name, email, address) &&
        hasAuthorizationHeaders(req);
    });
  }

  function expectUpdateCustomerResponse(customerId: string, name: string, email: string, address: CustomerAddress) {
    return httpMock.expectOne(req => {
      return req.method === 'POST' &&
        req.url === `${STRIPE_CUSTOMER_API_URL}/${customerId}` &&
        hasCustomerInfoParams(req, name, email, address) &&
        hasAuthorizationHeaders(req);
    });
  }

  function expectDeleteCustomerResponse(customerId: string) {
    return httpMock.expectOne(req => {
      return req.method === 'DELETE' &&
        req.url === `${STRIPE_CUSTOMER_API_URL}/${customerId}` &&
        hasAuthorizationHeaders(req);
    });
  }

  function hasAuthorizationHeaders(req: HttpRequest<any>) {
    return req.headers.get('Authorization') === `Bearer ${environment.STRIPE_API_KEY}` &&
      req.headers.get('Content-Type') === 'application/x-www-form-urlencoded';
  }

  function hasCustomerInfoParams(req: HttpRequest<any>, name: string, email: string, address: CustomerAddress) {
    return req.params.get('email') === email &&
      req.params.get('metadata[name]') === name &&
      req.params.get('metadata[address_city]') === address.city &&
      req.params.get('metadata[address_street]') === address.street &&
      req.params.get('metadata[address_houseNumber]') === address.houseNumber &&
      req.params.get('metadata[address_zipCode]') === address.zipCode;
  }
});
