import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {

  nameRef: string = 'user-form'
  Position: any = ['Back-end Developer', 'Font-end Developer', 'Software Intern'];
  constructor(public fb: FormBuilder) {}
  userForm = this.fb.group({
    positionName: ['', [Validators.required]],
  });

  changePosition(e: any) {
    this.positionName?.setValue(e.target.value, {
      onlySelf: true,
    });
  }

  get positionName() {
    return this.userForm.get('positionName');
  }

  ngOnInit(): void {
  }

}
