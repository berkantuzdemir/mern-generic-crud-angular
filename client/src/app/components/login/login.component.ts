import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  constructor(public fb: FormBuilder, private http: HttpClient) { }

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
}
