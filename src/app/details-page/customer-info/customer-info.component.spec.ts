import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerInfoComponent } from './customer-info.component';
import { AddressPipeModule } from '../../shared/pipes/address/address.module';
import { Customer } from '../../shared/models/Customer';
import { By } from '@angular/platform-browser';

describe('CustomerInfoComponent', () => {
  let component: CustomerInfoComponent;
  let fixture: ComponentFixture<CustomerInfoComponent>;

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
    TestBed.configureTestingModule({
      imports: [
        AddressPipeModule
      ],
      declarations: [
        CustomerInfoComponent
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerInfoComponent);
    component = fixture.componentInstance;
    component.customer = customer;
    fixture.detectChanges();
  });

  it('should list customer properties', () => {
    expect(queryProperties().map(item => item.nativeElement.textContent)).toEqual([
      'Customer ID: 1',
      'Customer name: Name',
      'Customer email: email@email.com',
      'Customer address: Street 1, City 12345'
    ]);
  });

  function queryProperties() {
    return fixture.debugElement.queryAll(By.css('.property'));
  }
});
