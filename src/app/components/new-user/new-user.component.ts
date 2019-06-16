import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdministratorService } from 'src/app/services/administrator.service';
import { Router } from '@angular/router';
import { User } from 'src/app/model/user.model';
import { Administrator } from 'src/app/model/administrator.model';
import { Evento } from 'src/app/model/evento.model';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css']
})
export class NewUserComponent implements OnInit {

  cadastroForm: FormGroup;
  admin: Administrator;


  constructor(
    private admservice: AdministratorService,
    private router: Router,
    private formBuilder: FormBuilder,
    private title: Title
  ) {
    title.setTitle("Cadastre-se - Descubra!")
   }

  ngOnInit() {
    this.cadastroForm = this.formBuilder.group({
      events: [],
      lastName: ['', Validators.required],
      password: ['', Validators.required],
      name: ['', Validators.required],
      email: ['', Validators.required]
    });
  }

  onSubmit(f: any) {
    this.admin = new Administrator(new Array<Evento>(), new User(f.email, f.password, f.name,  f.lastName))
    this.admservice.createOrUpdate(this.admin)
    .subscribe(data=>{
      this.admservice.login(f.email, f.password).subscribe(data=>{
        this.router.navigate(['/dashboard']);
        alert("Usuário criado com sucesso");
        console.log(data)
      },
      error => {
        console.error(error);
      });
    },
    error => {
      console.log(error);
    })
  }

}
