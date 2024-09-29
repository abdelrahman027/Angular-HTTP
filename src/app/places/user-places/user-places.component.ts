import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { HttpClient } from '@angular/common/http';
import { Place } from '../place.model';
import { map } from 'rxjs';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent implements OnInit {
  places = signal<Place[] | undefined>(undefined);
  httpClient = inject(HttpClient);
  destroyRef =inject(DestroyRef);
  placesService = inject(PlacesService);
  isFetching = signal(false);
  error = signal('');

  ngOnInit() {
    this.isFetching.set(true);
   const subscription = this.placesService.loadUserPlaces().subscribe({
      next:(resData)=>{this.places.set(resData)},
      error:(err)=>{
        
        this.error.set(err)
      },
      complete:(()=>this.isFetching.set(false))
    })

    this.destroyRef.onDestroy(()=>{
        subscription.unsubscribe();
    })
  }
}
