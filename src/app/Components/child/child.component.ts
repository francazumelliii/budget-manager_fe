import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../Services/authentication.service';
import { Expense, User, Role, Income, MonthlyStats, Pagination, Page, Project, Account,  } from '../../Interfaces/interface';
import { RoleService } from '../../Services/role.service';
import { formatDate } from '@angular/common';
import { ModalService } from '../../Services/modal.service';
import { TableComponent } from '../table/table.component';
import { ExpenseComponent } from '../expense/expense.component';
import { IncomeComponent } from '../income/income.component';
import { SingleProjectComponent } from '../single-project/single-project.component';
import { FormGroup } from '@angular/forms';
import { FormGroupService } from '../../Services/form-group.service';
import { AccountComponent } from '../account/account.component';
import { OptionModalComponent } from '../option-modal/option-modal.component';
import { ChildrenComponent } from '../children/children.component';

@Component({
  selector: 'app-child',
  templateUrl: './child.component.html',
  styleUrl: './child.component.sass',
})
export class ChildComponent {
  editForm!: FormGroup;
  parent !:Account;

  constructor(
    public authService: AuthenticationService,
    private route: ActivatedRoute,
    private roleService: RoleService,
    private modalService: ModalService,
    private formService: FormGroupService
  ) {
    this.editForm = this.formService.signupForm;
    this.parent = authService.userInformation
  }
  child!: User;
  expensesList: Expense[] = [];
  incomesList: Income[] = [];
  projectsList: Project[] = [];
  monthlyStats: { name: string; value: any }[] = [];
  maxValue: number = 0;
  percentage: number = 0;
  _isEditAllowed: boolean = false;

  ngAfterContentInit(): void {
    this.route.params.subscribe((param) => {
      this.getChildrenInformation(+param['id']);
      this.getAllChildExpenses(+param['id']);
      this.getAllChildIncomes(+param['id']);
      this.getAllChildProjects(+param['id']);
      this.getMonthlyChildStats(+param['id']);
    });
  }

  getChildrenInformation(id: number) {
    const user: User = this.authService.userInformation;
    user.children?.map((child: User) =>
      child.id === id ? (this.child = child) : null
    );
    if (this.child == null || this.child == undefined) {
      this.authService.redirect('homepage');
    }
    this.valorizeForm(this.child);
  }
  goBack() {
    this.authService.redirect('children');
  }

  getAllChildExpenses(id: number) {
    this.roleService.allChildExpenses(id, 0, 6, 'date', 'asc')?.subscribe(
      (response: Page<Expense>) => {
        this.expensesList = response.records;
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  getAllChildIncomes(id: number) {
    this.roleService.allChildIncomes(id, 0, 6, 'date', 'asc')?.subscribe(
      (response: Page<Income>) => {
        this.incomesList = response.records;
      },
      (error: any) => {
        console.error(error);
      }
    );
  }
  getMonthlyChildStats(id: number) {
    this.roleService
      .childMonthlyStats(id, formatDate(new Date(), 'yyyy-MM-dd', 'en-US'))
      ?.subscribe(
        (response: MonthlyStats) => {
          this.monthlyStats = [
            { name: 'Total Expenses', value: response.totalExpense },
          ];
          this.maxValue = response.totalIncome;
          this.percentage = response.totalIncome / response.totalExpense / 100;
        },
        (error: any) => {
          console.error(error);
        }
      );
  }
  isExpensesOpened = true;
  isIncomesOpened = true;

  toggleExpenses(isOpened: boolean) {
    this.isExpensesOpened = isOpened;
  }

  toggleIncomes(isOpened: boolean) {
    this.isIncomesOpened = isOpened;
  }
  async openModal(type: string, id: number | null = null) {
    if (type === 'expenses' && this.expensesList.length >= 0) {
      const componentRef = await this.modalService.open(
        ExpenseComponent,
        { childId: this.child.id },
        `ALL ${type.toUpperCase()}`,
        '85vh'
      );
      this.modalService.updateChildInputs({ expensesList: this.expensesList });
    } else if (type === 'incomes' && this.incomesList.length >= 0) {
      const componentRef = await this.modalService.open(
        IncomeComponent,
        { childId: this.child.id },
        `ALL ${type.toUpperCase()}`,
        '85vh'
      );
      this.modalService.updateChildInputs({ incomesList: this.incomesList });
    } else if (type === 'project' && this.projectsList.length >= 0) {
      const componentRef = await this.modalService.open(
        SingleProjectComponent,
        { childId: this.child.id, childProjectId: id },
        `PROJECT`,
        '85vh'
      );
    }
  }

  getAllChildProjects(id: number) {
    this.roleService.allChildProjects(id).subscribe(
      (response: Project[]) => {
        this.projectsList = response;
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  valorizeForm(user: User) {
    this.editForm.get('name')?.setValue(user.name);
    this.editForm.get('surname')?.setValue(user.surname);
    this.editForm.get('email')?.setValue(user.email);
    if (!this._isEditAllowed) {
      this.editForm.get('surname')?.disable();
      this.editForm.get('email')?.disable();
      this.editForm.get('name')?.disable();
    }
  }
  allowEdit() {
    this._isEditAllowed = !this._isEditAllowed;
    if(this._isEditAllowed){
      this.editForm.get('surname')?.enable();
      this.editForm.get('name')?.enable();
    }
  }
  patchChild(){
    const name = this.editForm.get("name")?.value.trim();
    const surname = this.editForm.get("surname")?.value.trim();
    const body = {
      name: name,
      surname: surname
    }
    this.roleService.patchChild(this.child.id, body)
      .subscribe((response:Account) => {
        this.authService.storeUserInformation(response)
        this.child = response.children?.find(c => c.email === this.child.email) ?? this.child
      },(error: any) => {
        console.error(error)
      })
  }

  async openDeleteModal(){
    const modalRef = await this.modalService.open(OptionModalComponent, {
      confirmLabel: "CONFIRM",
      cancelLabel: "CANCEL",
      title: "Are you sure you want to delete your child?",
      subtitle : "This action is irreversible!",
      description: ""
    })
    modalRef.instance.confirm.subscribe((data: any) => this.deleteChild())
    modalRef.instance.cancel.subscribe((data: any) => this.modalService.close())
  }

  deleteChild() {
    this.roleService.deleteChild(this.child.id)
      .subscribe({
        next: (response: any) => {
          this.modalService.close();
  
          if (this.parent.children) {
            const index = this.parent.children?.findIndex(c => c.id === this.child.id);

            if (index !== -1) {
              this.parent.children.splice(index, 1);
            }else console.log("child not found")
          }
          this.authService.storeUserInformation(this.parent);

          this.authService.redirect("children");
        },
        error: (error: any) => {
          console.error(error);
        }
      });
  }
  
}
