import { MyEventsComponent } from './components/dashboard/my-events/my-events.component';
import { AuthGuard } from './security/auth.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EventListComponent } from './components/home/event-list.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NewEventComponent } from './components/dashboard/new-event/new-event.component';
import { EditEventComponent } from './components/dashboard/edit-event/edit-event.component';
import { InterestListComponent } from './components/dashboard/interest-list/interest-list.component';
import { FeedbacksComponent } from './components/dashboard/feedbacks/feedbacks.component';

const routes: Routes = [
  {path: '', component:EventListComponent},
  {path: 'dashboard', component:DashboardComponent, canActivate:[AuthGuard]},
  {path: 'dashboard/criar-evento', component:NewEventComponent, canActivate:[AuthGuard]},
  {path: 'meus-interesses', component:InterestListComponent, canActivate:[AuthGuard]},
  {path: 'dashboard/meus-eventos', component:MyEventsComponent, canActivate:[AuthGuard]},
  {path: 'dashboard/meus-eventos/:id', component:EditEventComponent, canActivate:[AuthGuard]},
  {path: 'dashboard/meus-eventos/:id/avaliacoes', component:FeedbacksComponent, canActivate:[AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
