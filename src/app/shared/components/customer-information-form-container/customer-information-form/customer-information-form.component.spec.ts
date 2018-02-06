import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { CustomerInformationFormComponent } from './customer-information-form.component';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('CustomerInformationFormComponent', () => {
  let component: CustomerInformationFormComponent;
  let fixture: ComponentFixture<CustomerInformationFormComponent>;

  let nameInput: DebugElement;
  let emailInput: DebugElement;
  let cityInput: DebugElement;
  let streetInput: DebugElement;
  let houseNumberInput: DebugElement;
  let zipCodeInput: DebugElement;
  let saveButton: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule
      ],
      declarations: [
        CustomerInformationFormComponent
      ]
    });
  });

  beforeEach(fakeAsync(() => {
    fixture = TestBed.createComponent(CustomerInformationFormComponent);
    component = fixture.componentInstance;
    component.name = 'qwe';
    component.email = '';
    component.address = {
      city: '',
      street: '',
      houseNumber: '',
      zipCode: ''
    };
    spyOn(component.formSubmitted, 'emit').and.callFake(() => {});

    nameInput = queryNameInput();
    emailInput = queryEmailInput();
    cityInput = queryCityInput();
    streetInput = queryStreetInput();
    houseNumberInput = queryHouseNumberInput();
    zipCodeInput = queryZipCodeInput();
    saveButton = querySaveButton();

    fixture.detectChanges();
    tick();
  }));

  it('should emit formSubmitted event if form is filled correctly', fakeAsync(() => {
    // Given
    const name = 'John';
    const email = 'john@gmail.com';
    const city = 'London';
    const street = 'Oxford st.';
    const houseNumber = '16';
    const zipCode = '67895';

    // When
    enterValue(nameInput, name);
    enterValue(emailInput, email);
    enterValue(cityInput, city);
    enterValue(streetInput, street);
    enterValue(houseNumberInput, houseNumber);
    enterValue(zipCodeInput, zipCode);
    click(saveButton);

    // Then
    expect(component.formSubmitted.emit).toHaveBeenCalledWith({name, email, address: {city, street, houseNumber, zipCode}});
  }));

  it('should not emit formSubmitted event if not all form fields are filled', fakeAsync(() => {
    // Given
    const name = 'John';

    // When
    enterValue(nameInput, name);
    click(saveButton);

    // Then
    expect(component.formSubmitted.emit).not.toHaveBeenCalled();
  }));

  it('should not emit formSubmitted event if not all form fields are filled', fakeAsync(() => {
    // Given
    const name = 'John';

    // When
    enterValue(nameInput, name);
    click(saveButton);

    // Then
    expect(component.formSubmitted.emit).not.toHaveBeenCalled();
  }));

  it('should show error message', () => {
    // Given
    expect(queryErrorMessage()).toBe(null);

    // When
    component.errorMessage = 'Error';
    fixture.detectChanges();

    // Then
    expect(queryErrorMessage()).not.toBe(null);
  });

  function queryNameInput() {
    return fixture.debugElement.query(By.css('#name-input'));
  }

  function queryEmailInput() {
    return fixture.debugElement.query(By.css('#email-input'));
  }

  function queryCityInput() {
    return fixture.debugElement.query(By.css('#city-input'));
  }

  function queryStreetInput() {
    return fixture.debugElement.query(By.css('#street-input'));
  }

  function queryHouseNumberInput() {
    return fixture.debugElement.query(By.css('#house-number-input'));
  }

  function queryZipCodeInput() {
    return fixture.debugElement.query(By.css('#zip-code-input'));
  }

  function querySaveButton() {
    return fixture.debugElement.query(By.css('[data-test-id="SaveButton"]'));
  }

  function queryErrorMessage() {
    return fixture.debugElement.query(By.css('[data-test-id="ErrorMessage"]'));
  }

  function enterValue(inputEl: DebugElement, value: string) {
    inputEl.nativeElement.value = value;
    inputEl.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    tick();
  }

  function click(el: DebugElement) {
    el.nativeElement.click();
    fixture.detectChanges();
    tick();
  }
});
