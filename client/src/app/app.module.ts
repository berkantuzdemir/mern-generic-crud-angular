import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './components/login/login.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularModule } from './module/angular/angular.module';
import { PopupListComponent } from './components/popup-list/popup-list.component';


@NgModule({
  declarations: [
    AppComponent,
    UserFormComponent,
    LoginComponent,
    UserListComponent,
    PopupListComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AngularModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
