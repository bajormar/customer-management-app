import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomersListComponent } from './customers-list.component';
import { AddressPipeModule } from '../../shared/pipes/address/address.module';
import { By } from '@angular/platform-browser';
import { Customer } from '../../shared/models/Customer';
import { RouterTestingModule } from '@angular/router/testing';

describe('CustomersListComponent', () => {
  let component: CustomersListComponent;
  let fixture: ComponentFixture<CustomersListComponent>;

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

  const listItemSelector = By.css('[data-test-id="ListItem"]');
  const deleteButtonSelector = By.css('[data-test-id="DeleteButton"]');
  const openDetailsLinkSelector = By.css('[data-test-id="OpenDetailsLink"]');
  const loadMoreButtonSelector = By.css('[data-test-id="LoadMoreButton"]');

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AddressPipeModule,
        RouterTestingModule
      ],
      declarations: [
        CustomersListComponent
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomersListComponent);
    component = fixture.componentInstance;
    component.customers = [customer1, customer2];
    component.hasMore = true;
    spyOn(component.deleteCustomerClicked, 'emit');
    spyOn(component.loadMoreClicked, 'emit');
    fixture.detectChanges();
  });

  it('should render list items from provided customer data', () => {
    // Then
    expect(queryListItems().length).toBe(2);
  });

  it('should emit deleteCustomerClicked event on delete button click', () => {
    // Given
    const deleteButton = queryListItems()[0].query(deleteButtonSelector).nativeElement;

    // When
    deleteButton.click();
    fixture.detectChanges();

    // Then
    expect(component.deleteCustomerClicked.emit).toHaveBeenCalledWith('1');
  });

  it('should have open details link for each list item', () => {
    // Given
    const openDetailsLink1 = queryListItems()[0].query(openDetailsLinkSelector).nativeElement;
    const openDetailsLink2 = queryListItems()[1].query(openDetailsLinkSelector).nativeElement;

    // Then
    expect(openDetailsLink1.pathname).toBe('/customer/1');
    expect(openDetailsLink2.pathname).toBe('/customer/2');
  });

  it('should emit loadMoreClicked event on load more button click', () => {
    // Given
    const loadMoreButton = queryLoadMoreButton().nativeElement;

    // When
    loadMoreButton.click();
    fixture.detectChanges();

    // Then
    expect(component.loadMoreClicked.emit).toHaveBeenCalled();
  });

  function queryListItems() {
    return fixture.debugElement.queryAll(listItemSelector);
  }

  function queryLoadMoreButton() {
    return fixture.debugElement.query(loadMoreButtonSelector);
  }
});
