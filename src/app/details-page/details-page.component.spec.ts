import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsPageComponent } from './details-page.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CustomerService } from '../shared/services/customer/customer.service';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { never } from 'rxjs/observable/never';
import { Customer } from '../shared/models/Customer';
import { of } from 'rxjs/observable/of';
import { Subject } from 'rxjs/Subject';
import { _throw } from 'rxjs/observable/throw';

describe('DetailsPageComponent', () => {
  let component: DetailsPageComponent;
  let fixture: ComponentFixture<DetailsPageComponent>;
  let customerService: CustomerService;
  let activatedRoute: ActivatedRoute;
  let router: Router;
  let routeParamsSubject: Subject<any>;

  const customer: Customer = {
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

  beforeEach(() => {
    const mockCustomerService = {
      getCustomer: () => never(),
      updateCustomer: () => never()
    };

    const mockRouter = {
      navigate: () => {
      }
    };

    routeParamsSubject = new Subject();
    const mockActivatedRoute = {
      paramMap: routeParamsSubject.asObservable()
    };

    TestBed.configureTestingModule({
      declarations: [
        DetailsPageComponent
      ],
      providers: [
        {provide: CustomerService, useValue: mockCustomerService},
        {provide: ActivatedRoute, useValue: mockActivatedRoute},
        {provide: Router, useValue: mockRouter}
      ],
      schemas: [
        NO_ERRORS_SCHEMA
      ]
    });
  });

  beforeEach(() => {
    customerService = TestBed.get(CustomerService);
    activatedRoute = TestBed.get(ActivatedRoute);
    router = TestBed.get(Router);

    fixture = TestBed.createComponent(DetailsPageComponent);
    component = fixture.componentInstance;
  });

  describe('onInit', () => {
    it('should query user data based on route customerId', () => {
      // Given
      spyOn(customerService, 'getCustomer').and.returnValue(of(customer));

      // When
      component.ngOnInit();
      routeParamsSubject.next(convertToParamMap({'customerId': '1'}));

      // Then
      expect(customerService.getCustomer).toHaveBeenCalledWith('1');
      expect(component.customerData).toEqual(customer);
    });

    it('should redirect user to main page if not existing customer id provided', () => {
      // Given
      spyOn(customerService, 'getCustomer').and.returnValue(_throw(customer));
      spyOn(router, 'navigate');

      // When
      component.ngOnInit();
      routeParamsSubject.next(convertToParamMap({'customerId': '1'}));

      // Then
      expect(customerService.getCustomer).toHaveBeenCalledWith('1');
      expect(router.navigate).toHaveBeenCalledWith(['']);
    });
  });

  describe('updateCustomer', () => {
    it('should update currently loaded customer data', () => {
      // Given
      component.customerData = customer;
      spyOn(customerService, 'updateCustomer').and.returnValue(of(customer));

      // When
      component.updateCustomer(customer.name, customer.email, customer.address);

      // Then
      expect(customerService.updateCustomer).toHaveBeenCalledWith(customer.id, customer.name, customer.email, customer.address);
      expect(component.customerData).toEqual(customer);
    });
  });

});
