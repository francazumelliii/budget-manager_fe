import { Injectable, OnInit } from '@angular/core';
import { FormBuilder,  FormControl, FormGroup, Validators } from '@angular/forms';


@Injectable({
  providedIn: 'root'
})
export class FormGroupService {

  loginFormGroup!: FormGroup
  signupFormGroup!: FormGroup


  constructor(
    private fb: FormBuilder
  ) { 
    this.buildLoginForm();
    this.buildSignupForm();
  } 



  buildLoginForm(){
    this.loginFormGroup = this.fb.group({
      email: new FormControl("", Validators.required),
      password: new FormControl("", Validators.required)
    })
  }

  buildSignupForm() {
    this.signupFormGroup = this.fb.group({
      name: new FormControl("", [Validators.required, Validators.minLength(3)]),
      surname: new FormControl("", [Validators.required, Validators.minLength(3)]),
      email: new FormControl("", [Validators.required, Validators.email]),
      password: new FormControl("", [Validators.required, Validators.minLength(8)]),
      repeatPassword: new FormControl("", [Validators.required, Validators.minLength(8)]),
      birthdate: new FormControl("", Validators.required)
    });
  }
  

  get loginForm() {
    return this.loginFormGroup;  
  }
  get signupForm() {
    return this.signupFormGroup;  
  }
  

}
