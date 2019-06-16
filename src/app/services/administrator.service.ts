import { Administrator } from './../model/administrator.model';
import { UserStorage } from './../model/user-storage.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { DESCUBRA_API } from './descubra.api';
import { map } from 'rxjs/operators';
import { Evento } from '../model/evento.model';
import { Recovery } from '../model/recovery.model';

@Injectable({
  providedIn: 'root'
})
export class AdministratorService {

  userStorage: UserStorage;

  private headers = new HttpHeaders({
    'Access-Control-Allow-Origin': '*'
  });

  constructor(private http: HttpClient) { }

  getAdmin(){
    if(this.getAdminId() != null){
      return this.http.get(`${DESCUBRA_API}/administrators/${this.getAdminId()}`)
    } else {
      return;
    }
  }

  login(email:string, password:string){
    return this.http.post(`${DESCUBRA_API}/login`, JSON.stringify({email, password}), {headers: this.headers} ).pipe(map((response:Response)=>localStorage.setItem('data', JSON.stringify(response))));
  }

  createOrUpdate(administrator:Administrator){
    return this.http.post(`${DESCUBRA_API}/administrators`,administrator);

    /*if (administrator.id != null && administrator.id != 0){
      return this.http.put(`${DESCUBRA_API}/administrators`,administrator);
    } else {
      administrator.id = null;
      return this.http.post(`${DESCUBRA_API}/administrators`,administrator);
    }*/
  }

  recoveryPassword(recovery:Recovery){
    return this.http.post(`${DESCUBRA_API}/recovery`, recovery)
  }

  getEventsByAdm(id:number){
    return this.http.get<Evento[]>(`${DESCUBRA_API}/administrators/${id}/events`)
  }

  getInterestEventsByAdm(id:number){
    return this.http.get<Evento[]>(`${DESCUBRA_API}/administrators/interested_events/${id}`)  
  }

  //Gets localStorage
  getAdminId(){
    this.userStorage = JSON.parse(localStorage.getItem('data'));
    if(this.userStorage != null){
      return this.userStorage.administrator_id;
    } else {
      return null;
    }
  }

  getAdminToken(){
    this.userStorage = JSON.parse(localStorage.getItem('data'));
    if (this.userStorage != null){
      return this.userStorage.accessToken;
    }
    return null;
  }

  isLoggedIn():boolean{
    if(this.getAdminToken() != null){
      return true;
    } else {
      return false;
    }
  }

  logout(){
    localStorage.clear();
  }
}
