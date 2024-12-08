import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../Services/authentication.service';
import { Expense, User, Role, Income, MonthlyStats, Pagination, Page, Project } from '../../Interfaces/interface';
import { RoleService } from '../../Services/role.service';
import { formatDate } from '@angular/common';
import { ModalService } from '../../Services/modal.service';
import { TableComponent } from '../table/table.component';
import { ExpenseComponent } from '../expense/expense.component';
import { IncomeComponent } from '../income/income.component';
import { SingleProjectComponent } from '../single-project/single-project.component';

@Component({
  selector: 'app-child',
  templateUrl: './child.component.html',
  styleUrl: './child.component.sass'
})
export class ChildComponent {
  constructor(
    public authService: AuthenticationService,
    private route: ActivatedRoute,
    private roleService: RoleService,
    private modalService: ModalService

  ){}
  child!: User 
  expensesList: Expense[] = []
  incomesList: Income[] = []
  projectsList: Project[] = []
  monthlyStats: {name: string, value: any}[] = []
  maxValue: number = 0;
  percentage: number = 0;

  ngAfterContentInit(): void {
    this.route.params.subscribe(param => {
      this.getChildrenInformation(+param['id'])
      this.getAllChildExpenses(+param['id'])
      this.getAllChildIncomes(+param['id'])
      this.getAllChildProjects(+param['id'])
      this.getMonthlyChildStats(+param['id'])
    })
  }

  getChildrenInformation(id: number){
    const user: User= this.authService.userInformation;
    user.children?.map((child: User) => child.id === id ? this.child = child : null)
    if(this.child == null || this.child == undefined){
      this.authService.redirect("homepage")
    }
  }
  goBack(){
    this.authService.redirect("children")
  }

  getAllChildExpenses(id: number){
    this.roleService.allChildExpenses(id, 0,6,'date','asc')
      ?.subscribe((response: Page<Expense>) => {
        this.expensesList = response.records
      },(error: any) => {
        console.error(error)
      })
  }

  getAllChildIncomes(id: number){
    this.roleService.allChildIncomes(id, 0,6,'date','asc')
      ?.subscribe((response: Page<Income> )=> {
        this.incomesList = response.records
      },(error: any) => {
        console.error(error)
      })
  }
  getMonthlyChildStats(id: number){
    this.roleService.childMonthlyStats(id, formatDate(new Date(), "yyyy-MM-dd", "en-US"))
      ?.subscribe((response: MonthlyStats) => {
        this.monthlyStats = [{name: "Total Expenses", value: response.totalExpense}]; 
        this.maxValue = response.totalIncome
        this.percentage = (response.totalIncome / response.totalExpense) / 100
      }, (error: any ) => {
        console.error(error)
      })
  }
  isExpensesOpened = true;
  isIncomesOpened = true;

  toggleExpenses(isOpened: boolean) {
    this.isExpensesOpened = isOpened;
  }

  toggleIncomes(isOpened: boolean) {
    this.isIncomesOpened = isOpened;
  }
  async openModal(type: string, id: number | null = null){
    if(type === 'expenses' && this.expensesList.length >= 0){
      const componentRef = await this.modalService.open(ExpenseComponent, {childId: this.child.id}, `ALL ${type.toUpperCase()}`, '85vh')
      this.modalService.updateChildInputs({expensesList: this.expensesList})
    }else if(type==='incomes' && this.incomesList.length >= 0){
      const componentRef = await this.modalService.open(IncomeComponent, {childId: this.child.id}, `ALL ${type.toUpperCase()}`, '85vh')
      this.modalService.updateChildInputs({incomesList: this.incomesList})
    }else if(type==='project' && this.projectsList.length >= 0){
      const componentRef = await this.modalService.open(SingleProjectComponent, {childId: this.child.id, childProjectId: id}, `PROJECT`, '85vh')
    }
  }

  getAllChildProjects(id: number){
    this.roleService.allChildProjects(id)
      .subscribe((response: Project[]) => {
        this.projectsList = response
      }, (error: any) => {
        console.error(error)
      })
  }

 
}
