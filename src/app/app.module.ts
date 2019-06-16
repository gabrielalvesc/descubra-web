import { AuthGuard } from './security/auth.guard';
import { AdministratorService } from './services/administrator.service';
import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common'
import localePt from '@angular/common/locales/pt'

import { ToastrModule } from 'ngx-toastr';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { AgmCoreModule } from '@agm/core';
import { StarRatingModule, StarRatingConfigService } from 'angular-star-rating';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { EventService } from './services/event.service';
import { UserService } from './services/user.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthInterceptor } from './security/auth.interceptor';
import { NewUserComponent } from './components/new-user/new-user.component';
import { NewEventComponent } from './components/dashboard/new-event/new-event.component';
import { HeaderComponent } from './components/header/header.component';
import { MyEventsComponent } from './components/dashboard/my-events/my-events.component';
import { EventListComponent } from './components/home/event-list.component';
import { EditEventComponent } from './components/dashboard/edit-event/edit-event.component';
import { FooterComponent } from './components/footer/footer.component';
import { InterestListComponent } from './components/dashboard/interest-list/interest-list.component';
import { NgxYoutubePlayerModule } from 'ngx-youtube-player';
import { FeedbacksComponent } from './components/dashboard/feedbacks/feedbacks.component';
import { CustomConfigServiceService } from './services/custom-config-service.service';

registerLocaleData(localePt)


@NgModule({
  declarations: [
    AppComponent,
    EventListComponent,
    DashboardComponent,
    NewUserComponent,
    NewEventComponent,
    HeaderComponent,
    MyEventsComponent,
    EditEventComponent,
    FooterComponent,
    InterestListComponent,
    FeedbacksComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    NgbModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDM7ymk5bBrTCjSo4MCBWREA0iljK9OyWw'
    }),
    NgxYoutubePlayerModule.forRoot(),
    StarRatingModule.forRoot()
  ],
  providers: [
    AdministratorService,
    EventService,
    UserService,
    AuthGuard,
    Title,
    { provide: LOCALE_ID, useValue: 'pt-BR'},
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: StarRatingConfigService, useClass: CustomConfigServiceService
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
