export interface CustomerDTO {
  id: string;
  email: string;
  metadata: {
    name: string;
    address_city: string
    address_street: string
    address_houseNumber: string
    address_zipCode: string
  };
}

export interface Customer {
  id: string;
  email: string;
  name: string;
  address: CustomerAddress;
}

export interface CustomerAddress {
  city: string;
  street: string;
  houseNumber: string;
  zipCode: string;
}
