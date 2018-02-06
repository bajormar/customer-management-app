import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainPageComponent } from './main-page.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CustomerService } from '../shared/services/customer/customer.service';
import { never } from 'rxjs/observable/never';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Customer } from '../shared/models/Customer';

describe('MainPageComponent', () => {
  let component: MainPageComponent;
  let fixture: ComponentFixture<MainPageComponent>;
  let customerService: CustomerService;
  let customerStateSubject: BehaviorSubject<any>;

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
    customerStateSubject = new BehaviorSubject({
      customers: [],
      hasMore: false
    });
    const mockCustomerService = {
      state$: customerStateSubject,
      loadCustomers: () => {
      },
      loadMoreCustomers: () => {
      },
      saveCustomer: () => {
      },
      deleteCustomer: () => {
      }
    };

    TestBed.configureTestingModule({
      declarations: [
        MainPageComponent
      ],
      providers: [
        {provide: CustomerService, useValue: mockCustomerService}
      ],
      schemas: [
        NO_ERRORS_SCHEMA
      ]
    });
  });

  beforeEach(() => {
    customerService = TestBed.get(CustomerService);

    fixture = TestBed.createComponent(MainPageComponent);
    component = fixture.componentInstance;
  });

  describe('onInit', () => {
    it('should call customerService for loading initial customers', () => {
      // Given
      spyOn(customerService, 'loadCustomers').and.returnValue(never());

      // When
      component.ngOnInit();

      // Then
      expect(customerService.loadCustomers).toHaveBeenCalled();
    });

    it('should subscribe to customer state changes', () => {
      // When
      component.ngOnInit();

      // Then
      expect(component.customers).toEqual([]);
      expect(component.hasMore).toEqual(false);

      // When
      customerStateSubject.next({
        customers: [customer1, customer2],
        hasMore: true
      });

      // Then
      expect(component.customers).toEqual([customer1, customer2]);
      expect(component.hasMore).toEqual(true);
    });
  });

  describe('saveCustomer', () => {
    it('should call customerService for saving new customer data', () => {
      // Given
      spyOn(customerService, 'saveCustomer');

      // When
      component.saveCustomer(customer1.name, customer1.email, customer1.address);

      // Then
      expect(customerService.saveCustomer).toHaveBeenCalledWith(customer1.name, customer1.email, customer1.address);
    });
  });

  describe('deleteCustomer', () => {
    it('should call customerService for deleting customer', () => {
      // Given
      spyOn(customerService, 'deleteCustomer');

      // When
      component.deleteCustomer(customer1.id);

      // Then
      expect(customerService.deleteCustomer).toHaveBeenCalledWith(customer1.id);
    });
  });

  describe('loadMore', () => {
    it('should call customerService for loading additional customers', () => {
      // Given
      spyOn(customerService, 'loadMoreCustomers');

      // When
      component.loadMore();

      // Then
      expect(customerService.loadMoreCustomers).toHaveBeenCalled();
    });
  });

  describe('onDestroy', () => {
    it('should unsubscribe from customers state changes', () => {
      // Given
      component.ngOnInit();
      expect(customerStateSubject.observers.length).toBe(1);

      // When
      component.ngOnDestroy();

      // Then
      expect(customerStateSubject.observers.length).toBe(0);
    });
  });
});
