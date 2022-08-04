import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {

  nameRef: string = 'user-form'
  Position: string[] = ['Back-end Developer', 'Font-end Developer', 'Software Intern'];
  userForm!: FormGroup;

  constructor(public fb: FormBuilder) {}

  

  get positionName() {
    return this.userForm.get('positionName');
  }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      name: null,
      email: null,
      photo: null,
      startDate: null,
      positionName: null,
      department: null,
      university: null,
      graduation: null,
      previousJob: null,
      previousPosition: null,
      totalExperience: null,
      technicalSkills: null,
      about: null
    });
  }

  changePosition(e: any) {
    this.positionName?.setValue(e.target.value, {
      onlySelf: true,
    });
  }

}
