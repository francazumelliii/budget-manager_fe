import { Component } from '@angular/core';
import { FormGroupService } from '../../Services/form-group.service';
import { FormGroup } from '@angular/forms';
import { AuthenticationService } from '../../Services/authentication.service';
import { AuthResponse } from '../../Interfaces/interface';

@Component({
  selector: 'app-authentication-form',
  templateUrl: './authentication-form.component.html',
  styleUrl: './authentication-form.component.sass'
})
export class AuthenticationFormComponent {

  constructor(
    private formGroupService: FormGroupService,
    private authService: AuthenticationService
  ) {}

  signupForm: FormGroup = this.formGroupService.signupForm
  loginForm: FormGroup = this.formGroupService.loginForm
  template: 'LOGIN' | 'SIGNUP' = 'LOGIN'
  _arePasswordEquals: boolean = false;
  _isBirthdateValid: boolean = false;
  _isPasswordLengthValid: boolean = false;
  responseError: string = ""


  ngOnInit(): void {
    this.signupForm.reset()
    this.loginForm.reset();
  }



  switchTemplate(){
    console.log(this.template)
    this.template == 'LOGIN' ? this.template = "SIGNUP" : this.template = "LOGIN"
  }

  submitSignupForm(){
    if(!this.signupForm.touched){
      return
     
    }
    
    const name = this.signupForm.controls['name'].value;
    const surname = this.signupForm.controls['surname'].value;
    const email = this.signupForm.controls['email'].value;
    const password = this.signupForm.controls['password'].value;
    const birthdate = this.signupForm.controls['birthdate'].value

    this.authService.signup(name, surname, email, password,birthdate)
      .subscribe((response: AuthResponse) => {
        response ? this.storeInfo(response) : null

      },(error: any) => {
        error.status == 409 ? this.responseError = "A user with same email already exists": null
        error.status == 406 ? this.responseError = "You must be 18+": null
        console.error(error)
      })
    
    
  }
  submitLoginForm(){
    if(!this.loginForm.touched){
      return
    }
    const email = this.loginForm.controls['email'].value;
    const password = this.loginForm.controls['password'].value;

    this.authService.login(email, password)
      .subscribe((response: AuthResponse) => {
        console.log(response)
        response ? this.storeInfo(response) : null
      },(error: any) => {
        error.status == 401 ? this.responseError = "Email or password invalid": null
        error.status == 404 ? this.responseError = "Email not found": null
        console.error(error)
      })

  }

  storeInfo(response: AuthResponse){
    response.user? this.authService.storeUserInformation(response.user) : null
    response.jwt ? this.authService.storeToken(response.jwt): null
    this.authService.setDefaultCurrency(response.user.defaultCurrency)
  }
  checkPassword() {
    const password = this.signupForm.controls['password'].value;
    const repeatPassword = this.signupForm.controls['repeatPassword'].value;

    this._arePasswordEquals = password.toString() === repeatPassword.toString();

    this._isPasswordLengthValid = this._arePasswordEquals ? password.length >= 8 : true;
  }

  
  ngOnDestroy(): void {
    this.signupForm.reset()
    this.loginForm.reset()
    
  }

  checkBirthdate(){
    if(!this.signupForm.get("birthdate")?.touched) return ;

    const birthdate = new Date(this.signupForm.get("birthdate")?.value);
    const today = new Date();
    const age = today.getFullYear() - birthdate.getFullYear()
    this._isBirthdateValid = age >= 18 && age < 100


  }

}
