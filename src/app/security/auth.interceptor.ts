import { AdministratorService } from './../services/administrator.service';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class AuthInterceptor implements HttpInterceptor {

    constructor(
        private adminService: AdministratorService
    ){ }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let authRequest: any;
        const token = this.adminService.getAdminToken();

        if(this.adminService.isLoggedIn()){
            authRequest = req.clone({
                setHeaders: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return next.handle(authRequest);
        } else {
            return next.handle(req);
        }
    }
}