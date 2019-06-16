import { AdministratorService } from './../services/administrator.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {

    constructor(
        private adminService: AdministratorService,
        private route: Router
    ) { }

    canActivate(
        route: ActivatedRouteSnapshot, 
        state: RouterStateSnapshot): Observable<boolean> | boolean{
        if(this.adminService.isLoggedIn()){
            return true;
        }
        this.route.navigate(['/']);
        window.location.reload()
        return false;
    }
}