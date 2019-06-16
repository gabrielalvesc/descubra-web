import { AdministratorService } from './../../services/administrator.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  admin: any;
  isLoggedIn: boolean;

  constructor(
    private adminService: AdministratorService,
    private router: Router) { }

  ngOnInit() {
    this.getAdmin();
    this.isLoggedIn = this.adminService.isLoggedIn();
  }

  logout() {
    this.adminService.logout();
    this.ngOnInit()
  }

  getAdmin() {
    this.adminService.getAdmin().subscribe(response => {
      this.admin = response;
    });
  }


}
