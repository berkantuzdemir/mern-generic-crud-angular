import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/model/user';
import { AuthserviceService } from 'src/app/services/authservice.service';

@Component({
  selector: 'app-popup-list',
  templateUrl: './popup-list.component.html',
  styleUrls: ['./popup-list.component.css','../../../styles.css']
})
export class PopupListComponent implements OnInit {
  nameRef: string = 'user-form'
  Position: string[] = ['Back-end Developer', 'Font-end Developer', 'Software Intern'];
  userForm!: FormGroup;
  userData!:User 

  constructor(public fb: FormBuilder, private http: HttpClient, private Auth:AuthserviceService) { }

  ngOnInit(): void {
    console.log(this.userData)
    this.userForm = this.fb.group({
      fullname: [this.userData.fullname, Validators.required],
      email: [this.userData.email, [Validators.required, Validators.email]],
      photo: [this.userData.image,Validators.required],
      startDate: [formatDate(this.userData.firstJobDay, 'yyyy-MM-dd', 'en'), Validators.required],
      positionName: [this.userData.position, Validators.required],
      department: [this.userData.department,Validators.required],
      university: [this.userData.university,Validators.required],
      graduation: [formatDate(this.userData.graduationTime, 'yyyy-MM-dd', 'en'),Validators.required],
      previousJob: [this.userData.previousJob,Validators.required],
      previousPosition: [this.userData.previousWorkTitle,Validators.required],
      totalExperience: [this.userData.totalWorkTime,Validators.required],
      technicalSkills: [this.userData.skills,[Validators.required, Validators.minLength(20)]],
      about: [this.userData.description, [Validators.required, Validators.minLength(150)]]
    });
  }

  onSubmit() {
    var formData: any = new FormData();
    formData.append('fullname', this.userForm.get('name')?.value);
    formData.append('email', this.userForm.get('email')?.value);
    formData.append('file', this.userForm.get('photo')?.value);
    formData.append('firstJobDay', this.userForm.get('startDate')?.value);
    formData.append('totalWorkTime', this.userForm.get('totalExperience')?.value);
    formData.append('university', this.userForm.get('university')?.value);
    formData.append('graduationTime', this.userForm.get('graduation')?.value);
    formData.append('workTitle', this.userForm.get('position')?.value);
    formData.append('previousWorkTitle', this.userForm.get('previousPosition')?.value);
    formData.append('previousJob', this.userForm.get('previousJob')?.value);
    formData.append('skills', this.userForm.get('technicalSkills')?.value);
    formData.append('description', this.userForm.get('about')?.value);
    formData.append('department', this.userForm.get('department')?.value);

    this.Auth.putUser(formData).subscribe({
      next: (response) => console.log(response),
      error: (error) => console.log(error),
    })

    this.validateAllFormFields(this.userForm);
  }

  get fullname(): FormControl {
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



  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }

}
