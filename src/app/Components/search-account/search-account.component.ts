import { Component, EventEmitter, Input, input, Output } from '@angular/core';
import { RoleService } from '../../Services/role.service';
import { FormGroupService } from '../../Services/form-group.service';
import { FormGroup, FormsModule } from '@angular/forms';
import { Project, SimpleAccount } from '../../Interfaces/interface';
import { AuthenticationService } from '../../Services/authentication.service';
import { ShareReplayConfig } from 'rxjs';
import { ModalService } from '../../Services/modal.service';
import { MessageService } from 'primeng/api';
import { ToastService } from '../../Services/toast.service';

@Component({
  selector: 'app-search-account',
  templateUrl: './search-account.component.html',
  styleUrl: './search-account.component.sass'
})
export class SearchAccountComponent {

  constructor(
    private roleService: RoleService,
    private formService: FormGroupService,
    private authService: AuthenticationService,
    private modalService: ModalService,
    private toastService: ToastService
  ){}

  form: FormGroup = this.formService.addAccountForm
  @Output() success = new EventEmitter<Project>()
  @Input() project!: Project 
  _isLoading: boolean = false;
  _isEmailInvalid: boolean = false;
  email: string = "";
  accounts: SimpleAccount[] = []
  showConfirmDialog: boolean = false;
  userEmail = this.authService.userInformation.email
  ngOnInit(){
    this.showJoinedPeople()

  }



  searchAccount(){
    const email = this.form.get("email")?.value;
    
    if(
      this.accounts.some(account => account.email.toLowerCase() == email.toLowerCase()) 
      || this.userEmail.toLowerCase() == email.toLowerCase()
      || this.form.controls['email'].invalid)
      return;
    
    this._isLoading = true;
    this._isEmailInvalid = false;

   this.roleService.searchAccount(email)
    .subscribe((response: SimpleAccount) => {
      this._isLoading = false;
      this.accounts.unshift(response)

    },(error: any) => {
      this._isLoading = false;
      error.status === 404 ? this._isEmailInvalid = true :  console.error(error)
    })
  }

  postShareRequest(){
    const emails = this.accounts.map(a => {return a.email})
    this.roleService.postShareProject(emails, this.project.id)
      .subscribe((response: Project) =>{
        this.success.emit(response)
        this.modalService.close();
      },(error: any) => {
        console.error(error)
      })

  }
  showJoinedPeople(){
    this.accounts = this.project.accounts
  }


  ngOnDestroy(): void {
   this.form.reset()
    
  }
  removeAccountFromProject(email: string){
    this.switchTemplate()
    const index = this.accounts.findIndex((a: SimpleAccount) => a.email === email)
    this.accounts.splice(index,1)
    const projectId = this.project.id
    if(email == null) return;
    this.roleService.removeAccountFromProject(projectId, email)
      .subscribe((response: Project) => {
        this.project = response;
        this.success.emit(response)
        this.accounts = response.accounts
        this.toastService.showOne({severity: 'success', summary: "UPDATE", detail: "Account Removed Successfully"})
      },(error: any ) => {
        console.error(error)
      })  


  }
  switchTemplate(){
    this.showConfirmDialog = !this.showConfirmDialog;
  }




}
