import { Administrator } from 'src/app/model/administrator.model';
import { AdministratorService } from 'src/app/services/administrator.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EventService } from 'src/app/services/event.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Evento } from 'src/app/model/evento.model';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.css']
})
export class EditEventComponent implements OnInit {

  response: any;
  subcribe: Subscription;
  eventForm: FormGroup;
  id: number;
  evento: Evento;
  administratorId: number;
  admin: any;
  today: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private adminService: AdministratorService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) { }

  imagemUrl: string = '';

  onKeyUp(evento: KeyboardEvent) {
    console.log();
    this.imagemUrl = (<HTMLInputElement>evento.target).value;
  }

  ngOnInit() {
    this.subcribe = this.route.params.subscribe(
      (params: any) => {
        this.id = params['id'];

        this.eventService.findById(this.id).subscribe(
          response => {
            this.response = response;
            this.imagemUrl = this.response.imageLink;
            console.log(this.response)
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
              startDate: this.response.startDate,
              endDate: this.response.endDate,
              startHour: this.response.startHour,
              endHour: this.response.endHour,
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
    );

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

    this.administratorId = this.adminService.getAdminId();
    this.today = new Date().toISOString().split('T')[0];
    document.getElementById("startDate").setAttribute('min', this.today);
    document.getElementById("endDate").setAttribute('min', this.today);
  }

  onSubmit(f: any) {
    let video;
    if(f.videoLink != null){
      video = f.videoLink.split('=')
      video = video[1];
    } else {
      video = null;
    }
    
    this.evento = new Evento(f.name, f.description, f.category, f.startDate, f.endDate, f.startHour, f.endHour, f.address, f.location, f.imageLink, video, f.city, f.freePaid);
    this.eventService.update(this.evento, this.id)
      .subscribe(response => {
        this.showSuccess()
        this.router.navigate(['/dashboard/meus-eventos'])
      },
        error => {
          this.showError();
          console.log(error)
        })
  }

  //alerts
  showSuccess() {
    this.toastr.success('Alterações salvas', 'Aêêê')
  }

  showError() {
    this.toastr.error('Opsss... Não foi possível alterar o evento', 'Poxa... :(')
  }

}
