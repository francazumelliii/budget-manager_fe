import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  Expense,
  LinearChart,
  Project,
  SimpleAccount,
} from '../../Interfaces/interface';
import { RoleService } from '../../Services/role.service';
import { AuthenticationService } from '../../Services/authentication.service';
import { count } from 'console';
import { formatDate } from '@angular/common';
import { ExpenseComponent } from '../expense/expense.component';
import { ModalService } from '../../Services/modal.service';
import { ChoosePersonModalComponent } from '../choose-person-modal/choose-person-modal.component';

@Component({
  selector: 'app-single-project',
  templateUrl: './single-project.component.html',
  styleUrl: './single-project.component.sass',
})
export class SingleProjectComponent {
  constructor(
    private route: ActivatedRoute,
    private roleService: RoleService,
    public authService: AuthenticationService,
    private modalService: ModalService
  ) {}

  projectId!: number;
  project!: Project;
  totalSpent: number = 0;
  percentage: number = 0;
  domain: string = 'text-white';
  userExpenses: Expense[] = [];
  allExpenses: Expense[] = [];
  chartData: any[] = [];
  overBudget: boolean = false;
  splitType: 'EQUAL' | 'NON EQUAL' = 'EQUAL';

  ngOnInit() {
    this.route.params.subscribe((param) => {
      this.projectId = param['id'];
      this.getProject(param['id']);
    });
  }

  getProject(id: number) {
    this.roleService.getProject(id).subscribe(
      (response: Project) => {
        this.project = response;
        this.calculateTotalSpent(response);
        this.valorizeChart(response);
      },
      (error: any) => {
        console.error(error), this.authService.redirect('projects');
      }
    );
  }

  calculateTotalSpent(project: Project) {
    this.totalSpent = 0;
    project.expenses.forEach((exp: Expense) => {
      this.totalSpent += exp.amount;
    });
    this.percentage = (this.totalSpent / +project.goalAmount) * 100;
    this.selectColor(this.percentage);
  }

  selectColor(percentage: number) {
    if (percentage <= 50 && percentage > 0) {
      this.domain = 'text-green-400';
    } else if (percentage > 50 && percentage <= 75) {
      this.domain = 'text-amber-400';
    } else if (percentage > 75 && percentage <= 90) {
      this.domain = 'text-orange-400';
    } else {
      this.domain = 'text-red-400';
    }
  }
  formatDate(arg0: string, arg1: string, arg2: string) {
    return formatDate(arg0, arg1, arg2);
  }

  async openModal(expense: Expense) {
    const modalRef = await this.modalService.open(
      ChoosePersonModalComponent,
      { expense: expense, project: this.project },
      'CHOOSE ACCOUNTS',
      '90%'
    );
    modalRef.instance.buttonClick.subscribe(
      (data: { shared: SimpleAccount[]; nonShared: SimpleAccount[] }) => {
        console.log(expense);
        const body = { shared: data.shared };
        this.roleService
          .patchShared(body, expense.projectId, expense.id)
          .subscribe(
            (response: Project) => {
              this.project = response;
              this.modalService.close();
            },
            (error: any) => {
              console.error(error);
            }
          );
      }
    );
  }
  splitAmount(expense: Expense): number {
    const participant = expense.participants.find(
      (a) => a.email === this.authService.userInformation.email
    );
    return participant?.splitAmount ?? 0;
  }

  splitPercentage(expense: Expense): number {
    const splitAmount = this.splitAmount(expense);
    return this.totalSpent > 0 ? (splitAmount / this.totalSpent) * 100 : 0;
  }

  mySplitAmount(project: Project) {
    const userEmail = this.authService.userInformation.email;
    const creatorEmail = project.creator.email?.trim().toLowerCase(); 

    const account = project.accounts.find(
      (a) =>
        a.email?.trim().toLowerCase() === userEmail?.trim().toLowerCase()
    );
    if(!account && userEmail == project.creator.email){
      return project.creator.splitAmount ?? 0
    }



    return account?.splitAmount ?? 0;
  }
  mySplitPercentage(project: Project): number {
    const myAmount = this.mySplitAmount(project);
    if (myAmount) return (myAmount / this.totalSpent) * 100 
    else return 0
  }

  valorizeChart(project: Project) {
    const totalExpenses = project.expenses.reduce(
      (sum, exp) => sum + exp.amount,
      0
    );
    this.overBudget = totalExpenses >= project.goalAmount  

    this.chartData = [
      {
        name: 'Total Expenses',
        value: totalExpenses 
      },
      {
        name: 'Spending Goal',
        value:project.goalAmount
      },
    ];
  }
}
