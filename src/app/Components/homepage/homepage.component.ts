import { Component, ComponentRef, OnInit } from '@angular/core';
import { DatabaseService } from '../../Services/database.service';
import { RoleService } from '../../Services/role.service';
import { Category, Expense, Income, MonthlyStats, PostIncomeRequest, Project, User, WeeklyStats } from '../../Interfaces/interface';
import { ModalService } from '../../Services/modal.service';
import { QuickaccessModalComponent } from '../quickaccess-modal/quickaccess-modal.component';
import { ModalComponent } from '../modal/modal.component';
import { FormGroup } from '@angular/forms';
import { FormGroupService } from '../../Services/form-group.service';
import { formatDate } from '@angular/common';
import { response } from 'express';
import { title } from 'process';
import { AuthenticationService } from '../../Services/authentication.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.sass'
})
export class HomepageComponent implements OnInit{

  constructor(
    private dbService: DatabaseService,
    private roleService: RoleService,
    private modalService: ModalService,
    private formService: FormGroupService,
    private authService: AuthenticationService
  ){}

  recentExpensesList: Expense[] = []
  recentIncomesList: Income[] = []
  newExpenseForm !: FormGroup
  monthlyStats: any = [] 
  totalIncomes: number = 0;
  newIncomeForm !: FormGroup
  newTripForm !: FormGroup
  newChildForm !: FormGroup
  modal!: QuickaccessModalComponent
  error: string = ""
  percentage: number = 0;
  weeklyStats: WeeklyStats[] = []
  


  ngOnInit(){
    this.getLastMonthExpenses();
    this.getLastMonthIncomes()
    this.initFormGroups()
    this.getMonthlyStatsPerWeek()
    this.getMonthlyStats()

  }

  initFormGroups(){
    this.newExpenseForm = this.formService.newExpenseForm
    this.newIncomeForm = this.formService.newIncomeForm
    this.newTripForm = this.formService.newTripForm
    this.newChildForm = this.formService.signupForm
  }

  getLastMonthExpenses(){
    this.roleService.lastMonthExpenses(6)
      .subscribe((response: Expense[]) => {
        this.recentExpensesList = response
      }, (error: any) => {
        console.error("error: ", error)
      })
  }

  getLastMonthIncomes(){
    this.roleService.lastMonthIncomes(6)
      .subscribe((response: Income[]) => {
        this.recentIncomesList = response
      },(error: any) => {
        console.error("error", error)
      })
  }

  async openModal(type: string){
    const componentRef = await this.modalService.open(QuickaccessModalComponent, {type: type, responseError: this.error}, `NEW ${type}`)
    componentRef.instance.submit.subscribe((data: any) => {
      switch(data){
        case 'expense' : this.addNewExpense()
          break;
        case 'income' : this.addNewIncome()
          break; 
        case 'trip' : this.addNewTrip()
          break;
        case 'child' : this.addNewChild()
      }
    })
    
  }
  addNewExpense(){
    const name = this.newExpenseForm.get("name")?.value
    const amount = this.newExpenseForm.get("amount")?.value
    const description = this.newExpenseForm.get("description")?.value
    const frequency = this.newExpenseForm.get("frequency")?.value
    const category = this.newExpenseForm.get("category")?.value
    const project = this.newExpenseForm.get("project")?.value
    const image = this.newExpenseForm.get("image")?.value
    const date = this.newExpenseForm.get("date")?.value

    const body : any = {
      name: name,
      amount: amount,
      description: description,
      frequency: frequency,
      categoryId: category,
      projectId: project,
      image: image,
      date: formatDate(date, "yyyy-MM-dd","en-US")
    }

    this.roleService.postExpense(body)
      .subscribe((response: Expense) => {

        this.recentExpensesList.push(response);
        this.recentExpensesList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        this.recentExpensesList.pop()
        this.modalService.close()
        this.error = ""
        this.newExpenseForm.reset()

      },(error: any) => {
        this.error = "Internal Server Error, try later..."
        console.error("Error: ", error)
      })

  }

  addNewIncome(){
    const name = this.newIncomeForm.get("name")?.value;
    const description = this.newIncomeForm.get("description")?.value;
    const amount = this.newIncomeForm.get("amount")?.value;
    const frequency = this.newIncomeForm.get("frequency")?.value;
    const date = this.newExpenseForm.get("date")?.value
    const image = this.newIncomeForm.get("image")?.value;

    const body: PostIncomeRequest = {
      name: name,
      description: description,
      amount: amount,
      date: formatDate(date, "yyyy-MM-dd", "en-US"),
      frequency: frequency,
      image: image
    }
    this.roleService.postIncome(body)
      .subscribe((response: Income) => {

        this.recentIncomesList.push(response);
        this.recentIncomesList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        this.recentIncomesList.pop()
        
        this.modalService.close()
        this.error=""
        this.newIncomeForm.reset()

      }, (error: any) => {
        this.error = "Internal Server Error, try later..."
        console.error("Error", error)
      })
    
  }

  addNewTrip(){

    const name = this.newTripForm.get("name")?.value
    const description = this.newTripForm.get("description")?.value
    const image = this.newTripForm.get("image")?.value
    const goalAmount = this.newTripForm.get("goalAmount")?.value
    const body = {
      name: name,
      description: description, 
      image: image, 
      goalAmount: goalAmount
    }

    this.roleService.postTrip(body)
      .subscribe((response: Project) => {
        this.modalService.close()
        this.error = ""
      },(error: any) => {
        console.error("error", error)
        this.error = "Internal Server Error, try later... "
      })
  }
 
  addNewChild(){
    const name = this.newChildForm.get("name")?.value
    const surname = this.newChildForm.get("surname")?.value
    const email = this.newChildForm.get("email")?.value
    const password = this.newChildForm.get("password")?.value
    const birthdate = this.newChildForm.get("birthdate")?.value
    const image = this.newChildForm.get("image")?.value

    const body = {
      name: name,
      surname: surname, 
      email: email,
      password: password,
      birthdate: birthdate,
      image: image
    }

    this.roleService.postChild(body).subscribe(
      (response: User) => {
        this.modalService.close();
        this.error = ""; 
      },
      (error: any) => {
        if (error.status == 409) {
          this.error = "A user with the same email already exists";
        } else {
          this.error = "Internal Server Error, try later...";
        }
        console.error("Error", error);
        this.modalService.updateChildInputs({responseError: this.error})
      }
    );

  }

  getMonthlyStatsPerWeek(){
    const date = formatDate(new Date(), "yyyy-MM-dd", "en-US")
    this.roleService.monthlyStatsPerWeek(date, true)
      .subscribe((response: WeeklyStats[]) => {
        this.weeklyStats = response
      }, (error: any) => {
        console.error("error", error)
      })
  }

  getMonthlyStats(){
    const date = formatDate(new Date(), "yyyy-MM-dd", "en-US")
    this.roleService.monthlyStats(date)
      .subscribe((response: MonthlyStats) => {
        this.monthlyStats = [{name: "This Month Expenses", value: response.totalExpense}]
        this.totalIncomes = response.totalIncome

        this.calculatePercentage(response)

      },(error: any) => {
        console.error(error)
      })
  }

  calculatePercentage(item: MonthlyStats){
    const totalExpense = item.totalExpense  != null ? item.totalExpense : 0
    const totalIncome = item.totalIncome  != null ? item.totalIncome : 0
    this.percentage = (totalExpense / totalIncome) * 100
  }
  redirect(event: string){
    this.authService.redirect(`${event.toLowerCase()}s`)
  }
}
