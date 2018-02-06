import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerInformationFormContainerComponent } from './customer-information-form-container.component';
import { Customer } from '../../models/Customer';
import { AddressService } from '../../services/address/address.service';
import { of } from 'rxjs/observable/of';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('CustomerInformationFormContainerComponent', () => {
  let component: CustomerInformationFormContainerComponent;
  let fixture: ComponentFixture<CustomerInformationFormContainerComponent>;

  let addressService: AddressService;

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
    const mockAddressService = {
      validateAddress: () => {}
    };

    TestBed.configureTestingModule({
      declarations: [
        CustomerInformationFormContainerComponent
      ],
      providers: [
        {provide: AddressService, useValue: mockAddressService}
      ],
      schemas: [
        NO_ERRORS_SCHEMA
      ]
    });
  });

  beforeEach(() => {
    addressService = TestBed.get(AddressService);

    fixture = TestBed.createComponent(CustomerInformationFormContainerComponent);
    component = fixture.componentInstance;
    spyOn(component.customerSaved, 'emit');
  });

  describe('onInit', () => {
    it('should fill in form data if customer is provided', () => {
      // Given
      component.customer = customer;

      // When
      component.ngOnInit();

      // Then
      expect(component.name).toEqual(customer.name);
      expect(component.address).toEqual(customer.address);
      expect(component.email).toEqual(customer.email);
    });
  });

  describe('onFormSubmit', () => {
    it('should emit customerSaved event if address is valid', () => {
      // Given
      spyOn(addressService, 'validateAddress').and.returnValue(of({valid: true, errorMessage: null}));

      // When
      component.onFormSubmit(customer.name, customer.email, customer.address);

      // Then
      expect(component.invalidAddress).toBe(false);
      expect(component.errorMessage).toEqual(null);
      expect(component.customerSaved.emit).toHaveBeenCalledWith({name: customer.name, email: customer.email, address: customer.address});
    });

    it('should not emit customerSaved event if address is not valid', () => {
      // Given
      spyOn(addressService, 'validateAddress').and.returnValue(of({valid: false, errorMessage: 'Error'}));

      // When
      component.onFormSubmit(customer.name, customer.email, customer.address);

      // Then
      expect(component.invalidAddress).toBe(true);
      expect(component.errorMessage).toEqual('Error');
      expect(component.customerSaved.emit).not.toHaveBeenCalled();
    });
  });
});
