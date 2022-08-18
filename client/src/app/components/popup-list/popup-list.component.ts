import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-popup-list',
  templateUrl: './popup-list.component.html',
  styleUrls: ['./popup-list.component.css']
})
export class PopupListComponent implements OnInit {
  nameRef: string = 'user-form'
  Position: string[] = ['Back-end Developer', 'Font-end Developer', 'Software Intern'];
  userForm!: FormGroup;
  emailPattern: string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";

  constructor(public fb: FormBuilder, private http: HttpClient) { }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      fullname: [null],
      email: [null],
      photo: [null],
      startDate: [null],
      positionName: [null],
      department: [null],
      university: [null],
      graduation: [null],
      previousJob: [null],
      previousPosition: [null],
      totalExperience: [null],
      technicalSkills: [null],
      about: [null]
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
    // const headers= new HttpHeaders()
    // .set("x-access-token", localStorage.getItem("jwt"));

    this.http
      .post('http://localhost:4000/api/user', formData)
      .subscribe({
        next: (response) => console.log(response),
        error: (error) => console.log(error),
      });

    this.validateAllFormFields(this.userForm);
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



  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }

}
