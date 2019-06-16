import { AdministratorService } from 'src/app/services/administrator.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Evento } from 'src/app/model/evento.model';
import { EventService } from 'src/app/services/event.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-my-events',
  templateUrl: './my-events.component.html',
  styleUrls: ['./my-events.component.css'],
  viewProviders:[Title]
})
export class MyEventsComponent implements OnInit {

  listEventsAdm: Evento[];
  adminId: number;
  deleteButton:boolean = false;
  today:any;
  interests:any;
  eventForm: FormGroup;
  response: any;
  imagemUrl: string = '';
  event: Evento;

  ratingAdm:any;
  ratingEvent:any;
  ratingCategory:any;

  constructor(
    private adminService: AdministratorService,
    private router: Router,
    private route: ActivatedRoute,
    private eventService: EventService,
    private toastr: ToastrService,
    private title: Title,
    private formBuilder: FormBuilder
  ) {
    title.setTitle("Meus eventos - Descubra!")
   }

  ngOnInit() {
    this.adminId = this.adminService.getAdminId();
    this.adminService.getEventsByAdm(this.adminId)
      .subscribe(response => {
        this.listEventsAdm = response;
        console.log(response)
      })
    console.log(this.listEventsAdm)
    var date = new Date().toISOString().split('T')
    this.today = date[0]

    this.eventForm = this.formBuilder.group({
      eventId: [''],
      administratorId: [''],
      showInterested: [new Array<Evento>()],
      name: ['', Validators.required],
      imageLink: ['', Validators.required],
      videoLink:[''],
      category: ['', Validators.required],
      address: ['', Validators.required],
      location: ['', Validators.required],
      city: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      startHour: ['', Validators.required],
      endHour: ['', Validators.required],
      description: ['', Validators.required],
      freePaid: [null, Validators.required]
    })

  }

  delete(id: number) {
    this.eventService.delete(id)
      .subscribe(response => {
        this.success();
        this.ngOnInit();
      })
  }

  edit(id:number){
    this.router.navigate([`/dashboard/meus-eventos/${id}`])
  }

  viewFeedbacks(eventId:number){
    this.router.navigate([`/dashboard/meus-eventos/${eventId}/avaliacoes`])
  }

  viewInfo(eventId:number){
    this.interestNumber(eventId)
  }

  viewAnalyze(eventId:number, category:string){
    console.log(eventId, category)
    this.eventService.ratingAverageAdm(this.adminId).subscribe(res => {
      this.ratingAdm = res
      this.ratingAdm = this.ratingAdm.ratingAverage
    })
    this.eventService.ratingAverage(eventId).subscribe(res => {
      this.ratingEvent = res;
      this.ratingEvent = this.ratingEvent.eventAverage
    })
    this.eventService.ratingAverageCategory(category).subscribe(res => {
      this.ratingCategory = res;
      this.ratingCategory = this.ratingCategory.ratingAverage
    })
  }

  interestNumber(id:number){
    this.eventService.interestsNumber(id).subscribe(res =>{
      this.interests = res;
      this.interests = this.interests.count
      console.log(this.interests)
    })
  }

  republish(id:number){
    this.eventService.findById(id).subscribe(
      response => {
        this.response = response;
        this.imagemUrl = this.response.imageLink;
        if(this.response.videoLink != null){              
            this.response.videoLink = 'https://www.youtube.com/watch?v='+this.response.videoLink              
        }
        this.eventForm.setValue({
          eventId: [''],
          administratorId: [''],
          name: this.response.name,
          showInterested: [],
          imageLink: this.response.imageLink,
          videoLink: this.response.videoLink,
          category: this.response.category,
          address: this.response.address,
          location: this.response.location,
          city: this.response.city,
          startDate: [],
          endDate: [],
          startHour: [],
          endHour: [],
          description: this.response.description,
          freePaid: this.response.freePaid
        })
        if(this.response.videoLink != null){
          this.eventForm.setValue({
            videoLink: 'https://www.youtube.com/watch?v='+this.response.videoLink,
          })
        }
      }
    )

    if (this.response === null) {
      this.response = {};
    }  
  }

  onKeyUp(evento: KeyboardEvent) {
    this.imagemUrl = (<HTMLInputElement>evento.target).value;
    if(this.imagemUrl == ''){
      this.imagemUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Item_sem_imagem.svg/1024px-Item_sem_imagem.svg.png';
    }
    console.log();
  }

  onSubmit(f: any) {
    let video;
    if(f.videoLink != null){
      video = f.videoLink.split('=')
      video = video[1];
    } else {
      video = null;
    }

    this.event = new Evento(f.name, f.description, f.category, f.startDate, f.endDate, f.startHour, f.endHour, f.address, f.location, f.imageLink, video, f.city, f.freePaid);
    console.log(this.event)
    this.eventService.create(this.event)
      .subscribe(response => {
        this.toastr.success('Evento republicado com sucesso', 'Republicado')
        this.ngOnInit()
      },
        error => {
          this.toastr.error('Não foi possível republicar evento','Erro')
        })
  }

  //Alerts
  success() {
    this.toastr.success('Evento excluído', 'Sucesso', {
      timeOut: 5000
    })
  } 

}
