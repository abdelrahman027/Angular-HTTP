import { inject, Injectable, signal } from '@angular/core';

import { Place } from './place.model';
import { HttpClient } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private userPlaces = signal<Place[]>([]);
  httpClient= inject(HttpClient);

  loadedUserPlaces = this.userPlaces.asReadonly();

  loadAvailablePlaces() {
    return this.fetchPlaces('http://localhost:3000/places','somthing went wrong fetching places, please try again later!')
  }

  loadUserPlaces() {
    return this.fetchPlaces('http://localhost:3000/user-places','somthing went wrong fetching Favorite Places, please try again later!')
  }

  addPlaceToUserPlaces(placeId:string) {
    return this.httpClient.put('http://localhost:3000/user-places',{
      placeId
     })
  }

  removeUserPlace(place: Place) {}

  private fetchPlaces(url:string,errorMessage:string) {
     return this.httpClient.get<{places:Place[]}>(url).pipe(
      map((val)=>val.places),
      catchError((error)=>{
        console.log(error);
        return throwError(()=>{
          new Error(errorMessage)
        })
      })
     )
  }
}
