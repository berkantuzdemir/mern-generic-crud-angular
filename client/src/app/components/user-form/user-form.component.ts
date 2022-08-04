import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';


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

  ngOnInit(): void {
    this.userForm = this.fb.group({
      name: [null, Validators.required],
      email: [null, Validators.required],
      photo: [null, Validators.required],
      startDate: [null, Validators.required],
      positionName: [null, Validators.required],
      department: [null, Validators.required],
      university: [null, Validators.required],
      graduation: [null, Validators.required],
      previousJob: [null, Validators.required],
      previousPosition: [null, Validators.required],
      totalExperience: [null, Validators.required],
      technicalSkills: [null, Validators.required, Validators.minLength(20)],
      about: [null, Validators.required, Validators.minLength(150)]
    });
  }

  get name(): FormControl {
    return this.userForm.get('name') as FormControl;
  }

  get email(): FormControl {
    return this.userForm.get('email') as FormControl;
  }

  get photo(): FormControl {
    return this.userForm.get('photo') as FormControl;
  }

  get startDate(): FormControl {
    return this.userForm.get('startDate') as FormControl;
  }

  get positionName(): FormControl {
    return this.userForm.get('positionName') as FormControl;
  }

  get department(): FormControl {
    return this.userForm.get('department') as FormControl;
  }

  get university(): FormControl {
    return this.userForm.get('university') as FormControl;
  }

  get graduation(): FormControl {
    return this.userForm.get('graduation') as FormControl;
  }

  get previousJob(): FormControl {
    return this.userForm.get('previousJob') as FormControl;
  }

  get previousPosition(): FormControl {
    return this.userForm.get('previousPosition') as FormControl;
  }

  get totalExperience(): FormControl {
    return this.userForm.get('totalExperience') as FormControl;
  }

  get technicalSkills(): FormControl {
    return this.userForm.get('technicalSkills') as FormControl;
  }

  get about(): FormControl {
    return this.userForm.get('about') as FormControl;
  }

  changePosition(e: any) {
    this.positionName?.setValue(e.target.value, {
      onlySelf: true,
    });
  }

}
