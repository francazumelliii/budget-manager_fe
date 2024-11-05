import { Injectable, OnInit } from '@angular/core';
import { FormBuilder,  FormControl, FormGroup, Validators } from '@angular/forms';


@Injectable({
  providedIn: 'root'
})
export class FormGroupService {

  loginFormGroup!: FormGroup
  signupFormGroup!: FormGroup
  newExpenseFormGroup!: FormGroup
  newIncomeFormGroup!: FormGroup
  newTripFormGroup !: FormGroup

  today: any = new Date();


  constructor(
    private fb: FormBuilder
  ) { 
    this.buildLoginForm();
    this.buildSignupForm();
    this.buildNewExpenseForm()
    this.buildNewIncomeForm();
    this.buildNewTripForm();
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
      birthdate: new FormControl("", Validators.required),
      image: new FormControl("")
    });
  }
  buildNewExpenseForm(){
    this.newExpenseFormGroup = this.fb.group({
      name: new FormControl("", [Validators.required, Validators.minLength(1)]),
      amount: new FormControl("", [Validators.required, Validators.min(0.1)]),
      description: new FormControl(""),
      frequency: new FormControl("", Validators.required),
      date: new FormControl(this.today),
      category: new FormControl(""),
      image: new FormControl(""),
      project: new FormControl("")
    })

  }

  buildNewIncomeForm(){
    this.newIncomeFormGroup = this.fb.group({
      name: new FormControl("",[Validators.required, Validators.minLength(1)]),
      amount: new FormControl("", [Validators.required, Validators.min(0.1)]),
      description: new FormControl(""),
      image: new FormControl(""),
      frequency: new FormControl(""),
      date: new FormControl(this.today)

    })
  }

  buildNewTripForm(){
    this.newTripFormGroup = this.fb.group({
      name: new FormControl("", [Validators.required, Validators.minLength(1)]),
      description: new FormControl(""),
      image: new FormControl(""),
      goalAmount: new FormControl(0)
    })
  }
  

  get loginForm() {
    return this.loginFormGroup;  
  }
  get signupForm() {
    return this.signupFormGroup;  
  }
  get newExpenseForm(){
    return this.newExpenseFormGroup;
  }
  get newIncomeForm(){
    return this.newIncomeFormGroup
  }
  get newTripForm(){
    return this.newTripFormGroup;
  }

}
