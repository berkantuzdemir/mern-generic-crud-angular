import { Login } from './../../model/login';
import { AuthserviceService } from './../../services/authservice.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {


  user: Login;
  loginForm!: FormGroup;
  constructor(public fb: FormBuilder, private http: HttpClient, private Auth: AuthserviceService, private router: Router) {
    this.user = new Login();
   }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: [null, Validators.required],
      password: [null, Validators.required],
    });
  }
  get username(): FormControl {
    return this.loginForm.get('name') as FormControl;
  }

  get password(): FormControl {
    return this.loginForm.get('email') as FormControl;
  }
  onSubmit() {
    console.log('submit')
  }
  login(username:any,password:any) {

    this.Auth.postLogin({username, password}).subscribe(data => {
        this.Auth.Authdata = data;
        localStorage.setItem('jwt', this.Auth.Authdata.token);
        this.router.navigate(['/userlist'])
        console.log(data);
        console.log(data);
    })
     console.log(username);
     console.log(password);
  }
}
