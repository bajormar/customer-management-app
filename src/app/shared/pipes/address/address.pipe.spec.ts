import { AddressPipe } from './address.pipe';
import { AddressService } from '../../services/address/address.service';
import { CustomerAddress } from '../../models/Customer';

describe('AddressPipe', () => {
  let pipe: AddressPipe;
  let addressService: AddressService;

  beforeEach(() => {
    addressService = {
      formatAddress: () => {}
    } as any;

    pipe = new AddressPipe(addressService);
  });

  it('should return empty string if no address provided', () => {
    // Given
    const address = null;

    // When
    const formattedAddress = pipe.transform(address);

    // Then
    expect(formattedAddress).toBe('');
  });

  it('should return formatted string if address is provided', () => {
    // Given
    const address: CustomerAddress = {
      city: 'City',
      street: 'Street',
      houseNumber: '1',
      zipCode: '12345'
    };
    spyOn(addressService, 'formatAddress').and.returnValue('Street 1, City 12345');

    // When
    const formattedAddress = pipe.transform(address);

    // Then
    expect(formattedAddress).toBe('Street 1, City 12345');
    expect(addressService.formatAddress).toHaveBeenCalledWith(address);
  });
});
