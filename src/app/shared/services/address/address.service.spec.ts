import { TestBed } from '@angular/core/testing';

import { AddressService, GEOCODE_RESPONSE_STATUSES } from './address.service';
import { CustomerAddress } from '../../models/Customer';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../../environments/environment';

describe('AddressService', () => {
  let addressService: AddressService;
  let httpMock: HttpTestingController;

  const customerAddress: CustomerAddress = {
    city: 'City',
    street: 'Street',
    houseNumber: '1',
    zipCode: '12345'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        AddressService
      ]
    });
  });

  beforeEach(() => {
    httpMock = TestBed.get(HttpTestingController);
    addressService = TestBed.get(AddressService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('validateAddress', () => {
    it('should mark as valid if address matches exactly', () => {
      // When
      addressService.validateAddress(customerAddress).subscribe(validation => {
        // Then
        expect(validation.valid).toBe(true);
        expect(validation.errorMessage).toBe(null);
      });

      expectGeocodeResponse().flush({status: GEOCODE_RESPONSE_STATUSES.OK, results: [{}]});
    });

    it('should mark as valid if address matches partially', () => {
      // When
      addressService.validateAddress(customerAddress).subscribe(validation => {
        // Then
        expect(validation.valid).toBe(false);
        expect(validation.errorMessage).toBe('Partial match found. Please check if you made any mistakes');
      });

      expectGeocodeResponse().flush({status: GEOCODE_RESPONSE_STATUSES.OK, results: [{partial_match: true}]});
    });

    it('should mark as invalid if zero addresses found', () => {
      // When
      addressService.validateAddress(customerAddress).subscribe(validation => {
        // Then
        expect(validation.valid).toBe(false);
        expect(validation.errorMessage).toBe('No results found for given address');
      });

      expectGeocodeResponse().flush({status: GEOCODE_RESPONSE_STATUSES.ZERO_RESULTS});
    });

    it('should mark as invalid if query limit reached', () => {
      // When
      addressService.validateAddress(customerAddress).subscribe(validation => {
        // Then
        expect(validation.valid).toBe(false);
        expect(validation.errorMessage).toBe('Address validation query limit exceeded');
      });

      expectGeocodeResponse().flush({status: GEOCODE_RESPONSE_STATUSES.OVER_QUERY_LIMIT});
    });

    it('should mark as invalid if other status returned', () => {
      // When
      addressService.validateAddress(customerAddress).subscribe(validation => {
        // Then
        expect(validation.valid).toBe(false);
        expect(validation.errorMessage).toBe('Unknown status code: UNKNOWN STATUS');
      });

      expectGeocodeResponse().flush({status: 'UNKNOWN STATUS'});
    });
  });

  describe('formatAddress', () => {
    it('should format address from given CustomerAddress', () => {
      // When
      const formattedAddress = addressService.formatAddress(customerAddress);

      // Then
      expect(formattedAddress).toBe('Street 1, City 12345');
    });
  });

  function expectGeocodeResponse() {
    return httpMock.expectOne(req => {
      return req.method === 'GET' &&
        req.url === 'https://maps.googleapis.com/maps/api/geocode/json' &&
        req.params.get('address') === 'Street 1, City 12345' &&
        req.params.get('key') === environment.GOOGLE_MAPS_API_KEY;
    });
  }
});
