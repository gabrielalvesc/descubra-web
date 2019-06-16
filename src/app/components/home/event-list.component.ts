import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title, DomSanitizer } from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { Administrator } from 'src/app/model/administrator.model';
import { User } from 'src/app/model/user.model';
import { ShowInterest } from 'src/app/model/showInterest.model';
import { AdministratorService } from 'src/app/services/administrator.service';
import { Evento } from './../../model/evento.model';
import { EventService } from 'src/app/services/event.service';
import { Recovery } from 'src/app/model/recovery.model';






@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit {

  listEvents: any[];
  listCurrentEvents: any[];
  listFutureEvents: any[];
  isLoggedIn: boolean;
  pressed: boolean;
  listEventsInterested: any[];
  adminId: number;
  admin: any;
  interests: any;
  today:any;
  //Maps
  listAddress: any = [];
  latitude: number;
  longitude: number;
  eventSearch: any;
  //Forms
  recoveryForm: FormGroup;
  loginForm: FormGroup;
  filterForm: FormGroup;
  cadastroForm: FormGroup;
  //video
  player;

  eventOfadmin: boolean;

  constructor(
    private eventService: EventService,
    private router: Router,
    private adminService: AdministratorService,
    private title: Title,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) {
    title.setTitle("Home - Descubra!")
  }

  ngOnInit() {
    var date = new Date().toISOString().split('T')
    this.today = date[0]

    this.findAll();
    this.isLoggedIn = this.adminService.isLoggedIn();

    this.filterForm = this.formBuilder.group({
      category: [null],
      city: [null],
      time: [null],
    });

    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.cadastroForm = this.formBuilder.group({
      events: [],
      lastName: ['', Validators.required],
      password: ['', Validators.required],
      name: ['', Validators.required],
      email: ['', Validators.required]
    });

    this.recoveryForm = this.formBuilder.group({
      emailRecovery: ['', Validators.required]
    })

  }

  //Lista todos os eventos
  findAll() {
    this.eventService.getCurrentEvents().subscribe(res => {
      this.listEvents = res
      console.log(this.listEvents)
    })

    this.eventService.getFutureEvents().subscribe(res => {
      res.forEach(e => {
        this.listEvents.push(e)
      });
      console.log(this.listEvents)
    })
  }

  findCurrentEvents(){
    this.eventService.getCurrentEvents().subscribe(res => {
      this.listCurrentEvents = res;
      this.listEvents = res;
    })
  }

  findFutureEvents(){
    this.eventService.getFutureEvents().subscribe(res => {
      this.listEvents = res;
      this.listFutureEvents = res;
    })
  }

  value(time:any){
    if(time == "Todos"){
      this.findAll();
    } else if (time == "Futuros") {
      this.findFutureEvents();
    } else if (time == "No momento"){
      this.findCurrentEvents();
    }
  }


  //Buscas por eventos
  onSubmit(f: any) {
    if (f.city == null && f.category != null) {
      this.eventService.findByCategory(f.category).subscribe(res => {
        this.listEvents = res;
        this.filterForm.reset();
      })
    } else if (f.city != null && f.category == null) {
      this.eventService.findByCity(f.city).subscribe(res => {
        this.listEvents = res;
        this.filterForm.reset()
      })
    } else if (f.city != null && f.category != null) {
      this.eventService.findByCategoryAndCity(f.category, f.city).subscribe(res => {
        this.listEvents = res;
        this.filterForm.reset()
      })
    } else {
      this.ngOnInit()
    }
  }

  //========== SUBMITS ==========
  //Cadastro de usuário 
  onSubmitCadastro(f: any) {
    this.admin = new Administrator(new Array<Evento>(), new User(f.email, f.password, f.name, f.lastName))
    this.adminService.createOrUpdate(this.admin)
      .subscribe(data => {
        this.adminService.login(f.email, f.password).subscribe(data => {
          window.location.reload()
        },
          error => {
            console.error(error);
          });
      },
        error => {
          console.log(error);
        })
  }


  //Login do Usuário
  onSubmitLogin(f: any) {
    this.adminService.login(f.email, f.password)
      .subscribe(r => {
        this.router.navigate(['/dashboard/meus-eventos']);
        //window.location.reload();

      },
        error => {
          console.log(error)
          this.error();
          this.loginForm.reset()
        })

  }

  //Recuperação de senha
  onSubmitRecovery(f: any) {
    document.getElementById('body')
      .innerHTML = "<div align='center'><img src='../../../assets/images/load-login.gif'></div>"
    let recovery = new Recovery(f.emailRecovery)
    this.adminService.recoveryPassword(recovery)
      .subscribe(res => {
        this.toastr.success('Verifique seu e-mail', 'Senha recuperada')
        document.getElementById('body')
          .innerHTML = "<h4 align='center' style='color:#000935;'>Verifique seu email.</h4>"
      },
        error => {
          this.toastr.error('Infelizmente não encontramos esse email', 'Email inválido')
        })
  }

  error() {
    this.toastr.error('Email e/ou senha inválida', 'Que pena! Tente novamente :)')
  }

  //========== DEMONSTRAR INTERESSE ==========
  // Verifica o estado do botão (true or false)
  buscarInteresses(eventId: number) {
    this.eventService.interestedList(eventId).subscribe(res => {
      let list = []
      res.forEach(element => {
        list.push(element.administratorId);
      });
      console.log(list)
      let adminId = this.adminService.getAdminId()
      console.log(adminId)
      if (list.length != 0) {
        for (var i = 0; i <= list.length; i++) {
          if (adminId == list[i]) {
            this.pressed = true;
            console.log("true")
            break;
          } else {
            this.pressed = false;
          }
        }
      } else {
        this.pressed = false;
      }
    });
    this.eventService.findById(eventId).subscribe(res => {
      let event: any = res;
      let adminId = this.adminService.getAdminId();
      if (event.administratorId == adminId) {
        this.eventOfadmin = true;
      } else {
        this.eventOfadmin = false;
      }
      console.log("Evento pertence ao admin", this.eventOfadmin)
    })
    this.interestNumber(eventId)

  }

  interestNumber(id:number){
    this.eventService.interestsNumber(id).subscribe(res =>{
      this.interests = res;
      this.interests = this.interests.count
      console.log("Interesses: "+this.interests)
    })
  }

  //Demonstrar interesse ou cancelar interesse
  showInterest(idEvent: number, pressed: boolean) {
    console.log(pressed)
    if (pressed == false) {
      this.pressed = true;
      let showInterest = new ShowInterest(idEvent, this.adminService.getAdminId())
      console.log(showInterest)
      this.eventService.showInterest(showInterest).subscribe(res => {
        console.log(res)
        this.toastr.info("Evento adicionado à sua lista de interesse", "Interesse demonstrado")
      })
      this.interests++

    } else {
      this.pressed = false;
      let showInterest = new ShowInterest(idEvent, this.adminService.getAdminId())
      this.eventService.cancelInterest(showInterest).subscribe(res => {
        console.log("Excluído: ", res)
        this.toastr.info("Evento removido da sua lista de interesse", "Que pena :(")
      })
      this.interests--
    }
  }

  //========== MAPA ==========
  //Ver local de evento no mapa
  viewMaps(eventId: number) {
    this.eventService.findById(eventId).subscribe(response => {
      this.eventSearch = response;
      this.eventService.searchInMaps(this.eventSearch.location, this.eventSearch.address, this.eventSearch.city).subscribe(response => {
        this.listAddress = response;
        this.latitude = this.listAddress.results[0].geometry.location.lat
        this.longitude = this.listAddress.results[0].geometry.location.lng
        console.log(response);
      })
    });
  }

  //video
  pauseVideo(){
    this.player.pauseVideo();
  }

  savePlayer(player) {
    this.player = player;
  }

}
