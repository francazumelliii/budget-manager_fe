import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  Expense,
  LinearChart,
  PostProjectRequest,
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
import { FormGroup } from '@angular/forms';
import { FormGroupService } from '../../Services/form-group.service';
import { QuickaccessModalComponent } from '../quickaccess-modal/quickaccess-modal.component';
import { OptionModalComponent } from '../option-modal/option-modal.component';
import { SearchAccountComponent } from '../search-account/search-account.component';
import { ExecOptions } from 'child_process';

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
    private modalService: ModalService,
    private formService: FormGroupService
  ) {
    this.newExpenseForm = formService.newExpenseForm
    this.patchProjectForm = formService.newTripForm
  }
  @Input() childId: number | null = null;
  @Input() childProjectId : number | null = null
  projectId!: number;
  project!: Project;
  totalSpent: number = 0;
  percentage: number = 0;
  domain: string = 'text-white';
  userExpenses: Expense[] = [];
  allExpenses: Expense[] = [];
  chartData: any[] = [];
  overBudget: boolean = false;
  patchProjectForm !: FormGroup
  splitType: 'EQUAL' | 'NON EQUAL' = 'EQUAL';
  newExpenseForm!: FormGroup
  error: string = "";

  ngOnInit() {
    this.route.params.subscribe((param) => {
      this.projectId = param['id'];
        this.getProject(this.childId === null ? param['id'] : this.childProjectId);
    });
  }

  getProject(id: number) {
    this.roleService.getProject(this.childId, id).subscribe(
      (response: Project) => {
        this.project = response;
        this.calculateTotalSpent(response);
        this.valorizeChart(response);
        this.splitType = this.checkEqualExpenses(response) ? "EQUAL" : "NON EQUAL"
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
              this.splitType = this.checkEqualExpenses(response) ? 'EQUAL' : 'NON EQUAL';
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
  goBack(){
    this.authService.redirect("projects")
  }


  checkEqualExpenses(project: Project): boolean {
    const totalParticipants = project.accounts.length + 1;
    return project.expenses.every((exp :Expense) => exp.participants.length == totalParticipants)  

  }

  async openExpenseModal(){
    this.newExpenseForm.get("project")?.setValue(this.project.id)
    this.newExpenseForm.get("project")?.disable()
    this.newExpenseForm.get("frequency")?.setValue("S")
    this.newExpenseForm.get("frequency")?.disable()
    const componentRef = await this.modalService.open(
      QuickaccessModalComponent,
      { type: 'expense', responseError: this.error },
      'NEW EXPENSE'
    );
    componentRef.instance.submit.subscribe((data: any) => this.addNewExpense());
  }

  
  addNewExpense() {
    const name = this.newExpenseForm.get('name')?.value;
    const amount = this.newExpenseForm.get('amount')?.value;
    const description = this.newExpenseForm.get('description')?.value;
    const frequency = this.newExpenseForm.get('frequency')?.value;
    const category = this.newExpenseForm.get('category')?.value;
    const project = this.newExpenseForm.get('project')?.value;
    const image = this.newExpenseForm.get('image')?.value;
    const date = this.newExpenseForm.get('date')?.value;

    const body: any = {
      name: name,
      amount: amount,
      description: description,
      frequency: frequency,
      categoryId: category,
      projectId: project,
      image: image,
      date: date ? formatDate(date, 'yyyy-MM-dd', 'en-US') : formatDate(new Date(), "yyyy-MM-dd", "en-US")
    };

    this.roleService.postExpense(body).subscribe(
      (response: Expense) => {
        this.project.expenses.push(response)
        this.getProject(this.project.id)
        this.modalService.close()
        this.newExpenseForm.get("project")?.enable()
        this.newExpenseForm.get("project")?.setValue("")
        this.newExpenseForm.get("frequency")?.enable()
        this.newExpenseForm.get("frequency")?.setValue("")
      },
      (error: any) => {
        this.error = error
        console.error('Error: ', error);
      }
    );
  }
  
  async openEditModal(){
    this.patchProjectForm.get("name")?.setValue(this.project.name)
    this.patchProjectForm.get("description")?.setValue(this.project.description)
    this.patchProjectForm.get("goalAmount")?.setValue(this.project.goalAmount)
    this.patchProjectForm.get("image")?.setValue(this.project.image)

    const modalRef = await this.modalService.open(QuickaccessModalComponent, {type:"trip", isUpdate: true}, "EDIT TRIP")
    modalRef.instance.submit.subscribe((data: any) => {
      this.patchProject(this.project.id);
      this.modalService.close()
    })
    
  }

  patchProject(id: number){
    const name = this.patchProjectForm.get("name")?.value;
    const description = this.patchProjectForm.get("description")?.value;
    const goalAmount = this.patchProjectForm.get("goalAmount")?.value;
    const image = this.patchProjectForm.get("image")?.value;

    const body: PostProjectRequest = {
      name: name, 
      description: description,
      image: image,
      goalAmount: goalAmount
    }
    this.roleService.patchProject(body,id ) 
      .subscribe((response: Project) => {
        this.project = response
      },(error: any ) => {
        console.error(error)
      })
  }

  deleteProject(id: number){
    this.roleService.deleteProject(id)
      .subscribe((response: any) => {
        this.authService.redirect("projects")
        this.modalService.close()
      },(error: any) => {
        console.error(error)
      })
  }
  async openDeleteModal(){
    const modalRef = await this.modalService.open(OptionModalComponent, {
      title: "Are you sure you want to delete this project?",
      subtitle: "ATTENTION: All the project's expenses will be deleted!",
      description: "The action is irreversible!",
      confirmLabel: "CONFIRM",
      cancelLable: "CANCEL"
    }, "DELETE PROJECT")
    modalRef.instance.confirm.subscribe((data: any) => {
      this.deleteProject(this.project.id)
    })
    modalRef.instance.cancel.subscribe((data: any) => {
      this.modalService.close()
    })
  }

  async addAccountToProject(){

    const modalRef = await this.modalService.open(SearchAccountComponent, {project: this.project}, "ADD NEW ACCOUNT")
    modalRef.instance.success.subscribe((project: Project) => {
      this.project = project
    });
    
  }
  
  getUserName(expense: Expense){
    const user = this.project.accounts.find((account: SimpleAccount) => account.id === expense.accountId)
    if(user) return `${user.name} ${user.surname}`
    return `${this.project.creator.name} ${this.project.creator.surname}`
  }
}
