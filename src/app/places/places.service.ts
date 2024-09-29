import { inject, Injectable, signal } from '@angular/core';

import { Place } from './place.model';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap, throwError } from 'rxjs';
import { ErrorService } from '../shared/error.service';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private userPlaces = signal<Place[]>([]);
  httpClient= inject(HttpClient);
  errorService  = inject(ErrorService);

  loadedUserPlaces = this.userPlaces.asReadonly();

  loadAvailablePlaces() {
    return this.fetchPlaces('http://localhost:3000/places','somthing went wrong fetching places, please try again later!')
  }

  loadUserPlaces() {
    return this.fetchPlaces('http://localhost:3000/user-places','somthing went wrong fetching Favorite Places, please try again later!').pipe(tap({
      next:((userPlaces=>this.userPlaces.set(userPlaces)))
    }))
  }

  addPlaceToUserPlaces(place:Place) {
    const prevPlaces = this.userPlaces();
    if(!prevPlaces.some(p=>p.id == place.id))
    {

      this.userPlaces.set([...prevPlaces,place]);
    }
    return this.httpClient.put('http://localhost:3000/user-places',{
      placeId:place.id
     }).pipe(
      catchError(error => {
      this.errorService.showError('Failed to store selected Place')

        this.userPlaces.set(prevPlaces)
        return throwError(()=>new Error('Failed to store selected Place'))
      })
     )
  }

  removeUserPlace(place: Place) {
    const prevPlaces = this.userPlaces();
    if(prevPlaces.some(p=>p.id == place.id))
    {

      this.userPlaces.set(prevPlaces.filter(p=>p.id !==place.id))
    }
    return this.httpClient.delete('http://localhost:3000/user-places/' + place.id).pipe(catchError((error=>{
      console.log(error)
      this.errorService.showError('faild to remove selected place')
      return throwError(()=>{
        new Error('faild to remove selected place')
      })
    })))
  }

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
