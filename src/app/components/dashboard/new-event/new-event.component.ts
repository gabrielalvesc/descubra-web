import { AdministratorService } from './../../../services/administrator.service';
import { ToastrService } from 'ngx-toastr';
import { EventService } from 'src/app/services/event.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Evento } from 'src/app/model/evento.model';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-new-event',
  templateUrl: './new-event.component.html',
  styleUrls: ['./new-event.component.css']
})
export class NewEventComponent implements OnInit {



  eventForm: FormGroup;
  event: Evento;
  admin: any;
  today: any;

  imagemUrl: string = 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Item_sem_imagem.svg/1024px-Item_sem_imagem.svg.png';
  videoUrl: string = '';

  onKeyUp(evento: KeyboardEvent) {
    this.imagemUrl = (<HTMLInputElement>evento.target).value;
    if(this.imagemUrl == ''){
      this.imagemUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Item_sem_imagem.svg/1024px-Item_sem_imagem.svg.png';
    }
    console.log();
  }

  video(evento: KeyboardEvent){
    let video = (<HTMLInputElement>evento.target).value;
    this.videoUrl = 'https://www.youtube.com/embed/'+video.split('=')[1]
    console.log(this.videoUrl)
  }

  constructor(
    private eventService: EventService,
    private toastr: ToastrService,
    private router: Router,
    private formBuilder: FormBuilder,
    private adminService: AdministratorService,
    private title: Title
  ) {
    title.setTitle("Criar evento - Descubra!")
  }

  ngOnInit() {
    this.eventForm = this.formBuilder.group({
      name: ['', Validators.required],
      imageLink: ['', Validators.required],
      videoLink: [''],
      category: ['', Validators.required],
      address: ['', Validators.required],
      location: ['', Validators.required],
      city: ['', Validators.required],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      startHour: [null, Validators.required],
      endHour: [null, Validators.required],
      description: ['', Validators.required],
      freePaid: ['', Validators.required]
    })
    this.adminService.getAdmin().subscribe(
      response => {
        this.admin = response
      }
    );
    this.today = new Date().toISOString().split('T')[0];
    document.getElementById("startDate").setAttribute('min', this.today);
    document.getElementById("endDate").setAttribute('min', this.today);
  }


  onSubmit(f: any) {
    let video = f.videoLink.split('=')
    this.event = new Evento(f.name, f.description, f.category, f.startDate, f.endDate, f.startHour, f.endHour, f.address, f.location, f.imageLink, video[1], f.city, f.freePaid);
    console.log(this.event)
    this.eventService.create(this.event)
      .subscribe(response => {
        this.showSuccess()
        this.eventForm.reset()
        this.router.navigate(['/dashboard/meus-eventos'])
      },
        error => {
          this.showError();
        })
  }

  //alerts
  showSuccess() {
    this.toastr.success('Novo evento criado', 'Aêêê')
  }

  showError() {
    this.toastr.error('Opsss... Não foi possível criar o novo evento', 'Poxa... :(')
  }



}