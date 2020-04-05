import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NavComponent } from './nav/nav.component';
import { AuthRoutingModule } from './auth/auth-routing.module';
import { ContactsRoutingModule } from './contacts/contacts-routing.module';
import { MessagesRoutingModule } from './messages/messages-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    NavComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AuthRoutingModule,
    ContactsRoutingModule,
    MessagesRoutingModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
