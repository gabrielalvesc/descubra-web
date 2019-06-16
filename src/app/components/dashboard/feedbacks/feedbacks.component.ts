import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-feedbacks',
  templateUrl: './feedbacks.component.html',
  styleUrls: ['./feedbacks.component.css']
})
export class FeedbacksComponent implements OnInit {

  id:number;
  subscribe: Subscription;
  event: any;
  feedback: any[]
  stars: number;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService
  ) { }

  ngOnInit() {
    this.subscribe = this.route.params.subscribe((params:any)=>{
      this.id = params['id'];
    })

    this.eventService.findById(this.id).subscribe(res => {
      this.event = res
      this.feedback = this.event.eventFeedbacks
      console.log(this.feedback)
    })
  }



}
