import { Component, OnInit } from '@angular/core';
import { AdministratorService } from 'src/app/services/administrator.service';
import { Evento } from 'src/app/model/evento.model';
import { ToastrService } from 'ngx-toastr';
import { Title } from '@angular/platform-browser';
import { EventService } from 'src/app/services/event.service';
import { ShowInterest } from 'src/app/model/showInterest.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Feedback } from 'src/app/model/feedback.model';

@Component({
  selector: 'app-interest-list',
  templateUrl: './interest-list.component.html',
  styleUrls: ['./interest-list.component.css']
})
export class InterestListComponent implements OnInit {

  listEvents: Evento[];
  adminId: number;
  feedbackForm: FormGroup;
  //maps
  latitude: number;
  longitude: number;
  listAddress: any = [];
  eventSearch: any;
  today:any


  constructor(
    private adminService: AdministratorService,
    private eventService: EventService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private title: Title
  ) {
    title.setTitle('Meus interesses - Descubra!')
  }

  ngOnInit() {
    var date = new Date().toISOString().split('T')
    this.today = date[0]

    this.adminId = this.adminService.getAdminId();
    this.adminService.getInterestEventsByAdm(this.adminId).subscribe(res => {
      this.listEvents = res;
    });
    this.feedbackForm = this.formBuilder.group({
      rating:['',Validators.required],
      comment:['']
    })
  }

  clear(){
    this.feedbackForm.reset()
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

  //Remover evento da lista de interesses
  removeEvent(idEvent: number) {
    let showInterest = new ShowInterest(idEvent, this.adminId)
    this.eventService.cancelInterest(showInterest).subscribe(res => {
      this.toastr.info("O evento foi removido da sua lista de interesses", "Evento removido")
      this.ngOnInit();
    })
  }

  onSubmit(f:any, eventId:number){
    //console.log(eventId)
    let feedback = new Feedback(f.comment, f.rating, eventId);
    console.log(feedback)
    this.eventService.feedback(feedback)
    .subscribe(r => {
      this.toastr.success('Obrigado pela sua avaliação','Feedback Registrado')

    }, error => {
      this.toastr.error('Não foi possível registrar esse feedback','Opsss...')

    })
  }

}
