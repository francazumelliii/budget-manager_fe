import { Component, Input, OnInit, Output , EventEmitter, SimpleChanges, ChangeDetectorRef, OnChanges} from '@angular/core';
import { Category, Project } from '../../Interfaces/interface';
import { DatabaseService } from '../../Services/database.service';
import { FormControl, FormGroup } from '@angular/forms';
import { FormGroupService } from '../../Services/form-group.service';
import { isNumber } from 'util';

@Component({
  selector: 'app-quickaccess-modal',
  templateUrl: './quickaccess-modal.component.html',
  styleUrl: './quickaccess-modal.component.sass'
})
export class QuickaccessModalComponent implements OnInit{

  constructor(
    private formService: FormGroupService,
    private dbService: DatabaseService,
    private cd: ChangeDetectorRef
  ){

  }


  @Output() submit = new EventEmitter();
  @Input() type: string = ""
  @Input() responseError!: string 
  
  todayDate: any = new Date()
  categories: Category[] = []
  projects: Project[] = []
  newExpenseForm!: FormGroup
  newIncomeForm !: FormGroup
  newChildForm !: FormGroup
  newTripForm !: FormGroup
  _isBirthdateValid: boolean = false
  _arePasswordEquals: boolean = false
  error: string = "";

  frequencies:{id: any, name: string}[] = [
    {id: "S", name: "Single"},
    {id: "W", name: "Weekly"},
    {id: "M", name: "Monthly"},
    {id: "Y", name: "Annual"}
  ]
  
  
  ngOnInit(): void {
    this.initFormGroups()

    this.type === 'expense' ? (
      this.getAllCategories() ,
      this.getAllProjects()
    ): null
  
  }


  initFormGroups(){
    this.newExpenseForm = this.formService.newExpenseForm
    this.newIncomeForm = this.formService.newIncomeForm
    this.newTripForm = this.formService.newTripForm
    this.newChildForm = this.formService.signupForm

  }

  getAllCategories(){
    this.dbService.get("/categories/all")
      .subscribe((response: Category[]) => {
        this.categories = response
      },(error: any) => {
        console.error(error)
      })
  }

  getAllProjects(){
    this.dbService.get("/account/me/projects")
      .subscribe((response:Project[]) => {
        this.projects = response
      },(error: any ) => {
        console.error(error)
      })
  }


  checkNumbers = (formGroupName: "newExpenseForm" | "newIncomeForm" | "newTripForm", controlName: string) => {
    const formGroup = this[formGroupName] as FormGroup; 
    const control = formGroup.controls[controlName];
    
    if (!this.isNumeric(control.value)) {
      control.setValue(0);
    }
  }
  
  isNumeric(str: string) {
    return !isNaN(+str) && !isNaN(parseFloat(str)); 
  
  }
  submitForm(type: string){
    this.submit.emit(type)
  }
  
  checkBirthdate(){
    const birthDate = new Date(this.newChildForm.get("birthdate")?.value);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();

    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();
    
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    this._isBirthdateValid = age < 18;
}
checkPassword() {
  const password = this.newChildForm.controls['password'].value;
  const repeatPassword = this.newChildForm.controls['repeatPassword'].value;
  this._arePasswordEquals = password === repeatPassword;
}

}
