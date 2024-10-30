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
  template: 'LOGIN' | 'SIGNUP' = 'SIGNUP'
  _arePasswordEquals: boolean = false;
  responseError: string = ""


  ngOnInit(): void {
    
  }



  switchTemplate(){
    console.log(this.template)
    this.template == 'LOGIN' ? this.template = "SIGNUP" : this.template = "LOGIN"
  }

  submitSignupForm(){
    if(!this.signupForm.touched){
      return
      // TODO check birthdate validity
    }
    const name = this.signupForm.controls['name'].value;
    const surname = this.signupForm.controls['surname'].value;
    const email = this.signupForm.controls['email'].value;
    const password = this.signupForm.controls['password'].value;
    const birthdate = this.signupForm.controls['birthdate'].value

    this.authService.signup(name, surname, email, password,birthdate)
      .subscribe((response: AuthResponse) => {
        response.user? this.authService.storeUserInformation(response.user) : null
        response.jwt ? this.authService.storeToken(response.jwt): null

      },(error: any) => {
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
        response.user? this.authService.storeUserInformation(response.user) : null
        response.jwt ? this.authService.storeToken(response.jwt): null
      },(error: any) => {
        error.status == 401 ? this.responseError = "Email or password invalid": null
        error.status == 404 ? this.responseError = "Email not found": null
        console.error(error)
      })

  }

  checkPassword() {
    const password = this.signupForm.controls['password'].value;
    const repeatPassword = this.signupForm.controls['repeatPassword'].value;
    this._arePasswordEquals = password === repeatPassword;
  }

  
  ngOnDestroy(): void {
    this.signupForm.reset()
    this.loginForm.reset()
    
  }

}
