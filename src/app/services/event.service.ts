import { AdministratorService } from 'src/app/services/administrator.service';
import { Evento } from './../model/evento.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {RequestOptions, Headers} from '@angular/http';
import { Injectable } from '@angular/core';
import { DESCUBRA_API } from './descubra.api';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { ShowInterest } from '../model/showInterest.model';
import { Feedback } from '../model/feedback.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  PROXY_URL:string = 'https://cors-anywhere.herokuapp.com/';
  GOOGLE_API:string = "https://maps.googleapis.com/maps/api/place/textsearch/json?"
  URL:string = this.PROXY_URL + this.GOOGLE_API;
  API_KEY:string = "AIzaSyDM7ymk5bBrTCjSo4MCBWREA0iljK9OyWw";
  private headers = new HttpHeaders({
    'Content-Type':'application/json', 
    'Access-Control-Allow-Origin':'*'
  });

  constructor(private http: HttpClient, private adminService: AdministratorService) { }

  create(event:Evento){
    return this.http.post(`${DESCUBRA_API}/administrators/${this.adminService.getAdminId()}/events`,event);
  }

  delete(id:number){
    return this.http.delete(`${DESCUBRA_API}/events/${id}`);
  }

  getAllEvents(){
    return this.http.get<Evento[]>(`${DESCUBRA_API}/events`);
  }

  getCurrentEvents(){
    return this.http.get<Evento[]>(`${DESCUBRA_API}/events/current_events`)
  }

  getFutureEvents(){
    return this.http.get<Evento[]>(`${DESCUBRA_API}/events/future_events`)
  }

  findById(id:number){
    return this.http.get(`${DESCUBRA_API}/events/${id}`);
  }

  findByCategory(category:string){
    return this.http.get<any[]>(`${DESCUBRA_API}/events/filtering_category?category=${category}`)
  }

  findByCity(city:string){
    return this.http.get<any[]>(`${DESCUBRA_API}/events/filtering_city?city=${city}`)
  }

  findByCategoryAndCity(category:string, city:string){
    return this.http.get<any[]>(`${DESCUBRA_API}/events/filtering_both?city=${city}&category=${category}`)
  }

  update(event:any, id:number){
    return this.http.put(`${DESCUBRA_API}/administrators/${this.adminService.getAdminId()}/events/${id}`,event)
  }

  searchInMaps(location: string, address: string, city:string){
    return this.http.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${location},${address},${city},PB,Brasil&key=${this.API_KEY}`, {headers:this.headers})
    //return this.http.get(`${this.URL}query=${location}+${address}+${city}+Paraíba+Brasil&key=${this.API_KEY}`)
  }

  showInterest(showInterest: ShowInterest){ 
    return this.http.post(`${DESCUBRA_API}/events/showInterest`, showInterest)
  }

  cancelInterest(showInterest: ShowInterest){
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: {
        eventId: showInterest.eventId,
        administratorId: showInterest.administratorId,
      },
    };
    return this.http.delete(`${DESCUBRA_API}/events/showInterest/cancel`, options)
  }

  interestedList(eventId:number){
    return this.http.get<any[]>(`${DESCUBRA_API}/events/interested_list/${eventId}`)
  }

  feedback(feedback:Feedback){
    return this.http.post(`${DESCUBRA_API}/events/feedback`, feedback)
  }

  interestsNumber(id:number){
    return this.http.get(`${DESCUBRA_API}/events/${id}/interests_number`)
  }

  ratingAverage(id:number){
    return this.http.get(`${DESCUBRA_API}/events/${id}/rating_average`)
  }

  ratingAverageCategory(category:string){
    return this.http.get(`${DESCUBRA_API}/events/${category}/rating_average_category`)
  }

  ratingAverageAdm(id){
    return this.http.get(`${DESCUBRA_API}/events/${id}/rating_average_administrator`)
  }

}
