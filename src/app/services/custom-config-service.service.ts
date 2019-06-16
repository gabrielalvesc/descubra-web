import { Injectable } from '@angular/core';
import { StarRatingConfigService } from 'angular-star-rating';

@Injectable({
  providedIn: 'root'
})
export class CustomConfigServiceService extends StarRatingConfigService {

  constructor() { 
    super();
    this.numOfStars = 5;
    this.staticColor = 'ok';
    this.size = 'large';
  }
}
