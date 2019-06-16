import { AdministratorService } from './../../services/administrator.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  username: string;
  admin: any;

  constructor(
    private adminService: AdministratorService,
    private router: Router,
    private title: Title
  ) {
    title.setTitle("Dashboard - Descubra!")
   }

  ngOnInit() {
    this.adminService.getAdmin().subscribe(response => {
      this.admin = response;
    });
  }

}
