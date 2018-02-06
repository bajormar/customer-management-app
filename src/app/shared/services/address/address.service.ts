import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { CustomerAddress } from '../../models/Customer';
import { environment } from '../../../../environments/environment';

export const GEOCODE_RESPONSE_STATUSES = {
  OK: 'OK',
  OVER_QUERY_LIMIT: 'OVER_QUERY_LIMIT',
  ZERO_RESULTS: 'ZERO_RESULTS'
};

@Injectable()
export class AddressService {

  constructor(private httpClient: HttpClient) {
  }

  validateAddress(address: CustomerAddress): Observable<{ valid: boolean, errorMessage: string }> {
    const params = new HttpParams().set('address', this.formatAddress(address)).set('key', environment.GOOGLE_MAPS_API_KEY);

    return this.httpClient
      .get<{ status: string, results: any[] }>('https://maps.googleapis.com/maps/api/geocode/json', {params})
      .pipe(
        map(response => {
          const exactMatchFound =
            response.status === GEOCODE_RESPONSE_STATUSES.OK &&
            response.results.some(item => !item.partial_match);
          const errorMessage = this.transformStatusToErrorMessage(response.status, exactMatchFound);
          
          return {
            valid: exactMatchFound,
            errorMessage
          };
        })
      );
  }

  private transformStatusToErrorMessage(status: string, exactMatchFound: boolean): string {
    switch (status) {
      case GEOCODE_RESPONSE_STATUSES.OK:
        return exactMatchFound ? null : 'Partial match found. Please check if you made any mistakes';
      case GEOCODE_RESPONSE_STATUSES.OVER_QUERY_LIMIT:
        return 'Address validation query limit exceeded';
      case GEOCODE_RESPONSE_STATUSES.ZERO_RESULTS:
        return 'No results found for given address';
      default:
        return `Unknown status code: ${status}`;
    }
  }

  formatAddress(address: CustomerAddress): string {
    return `${address.street} ${address.houseNumber}, ${address.city} ${address.zipCode}`;
  }
}
