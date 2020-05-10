import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { AuthRoutingModule } from './auth/auth-routing.module';
import { ContactsRoutingModule } from './contacts/contacts-routing.module';
import { MessagesRoutingModule } from './messages/messages-routing.module';
import { DashboardModule } from './dashboard/dashboard.module';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AuthRoutingModule,
    DashboardModule,
    ContactsRoutingModule,
    MessagesRoutingModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
