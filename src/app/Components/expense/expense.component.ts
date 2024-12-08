import { Component, Input, OnInit } from '@angular/core';
import { RoleService } from '../../Services/role.service';
import { Expense, Page, Pagination, PostExpenseRequest } from '../../Interfaces/interface';
import { PaginatorState } from 'primeng/paginator';
import { FormGroupService } from '../../Services/form-group.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ModalService } from '../../Services/modal.service';
import { QuickaccessModalComponent } from '../quickaccess-modal/quickaccess-modal.component';
import { formatDate } from '@angular/common';
import { AuthenticationService } from '../../Services/authentication.service';
import { OptionModalComponent } from '../option-modal/option-modal.component';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.sass'], 
})
export class ExpenseComponent implements OnInit {
  constructor(
    private roleService: RoleService,
    private formService: FormGroupService,
    private modalService: ModalService,
    public authService: AuthenticationService
  ) {}

  expensesList: Expense[] = [];
  @Input() childId: number | null = null;
  _isSelectVisible: boolean = false;
  filterForm: FormGroup = this.formService.filterForm;
  _isUpdateAllowed: boolean = false;

  filterList: any = [
    {id: 'date', name: 'DATE'},
    {id: 'name', name: 'NAME'},
    {id: 'amount', name: 'AMOUNT'},
  ];
  
  error: string = '';
  pagination: Pagination = {
    rows: 10,
    first: 0,
    rowsPerPageOptions: [10, 15, 20],
    totalRecords: 0,
  };
  newExpenseForm: FormGroup = this.formService.newExpenseForm;

  ngOnInit(): void {
    if (this.childId== null) {
      this.getExpensePage(0, this.pagination.rows, 'date', 'ASC');
    }
  }
  
  ngOnChanges() {

    if (this.expensesList) {
      this.getExpensePageWithFilters()
    }
  }

  getExpensePage(
    page: number = 0,
    size: number = 10,
    order: string | null = null,
    direction: string | null = null
  ): void {
    const sortOrder = order ?? 'date';
    const sortDirection = direction ?? 'ASC';

    this.roleService
      .allExpensesPaging(this.childId, page, size, sortOrder, sortDirection)
      .subscribe(
        (response: Page<Expense>) => {

          this.expensesList = response.records;
          this.pagination = {
            rows: size,
            first: page * size,
            rowsPerPageOptions: [5, 10, 15],
            totalRecords: response.totalRecords,
          };
        },
        (error: any) => {
          console.error(error);
        }
      );
  }

  handlePageChange($event: PaginatorState): void {
    if ($event && $event.page !== undefined) {
      const page = $event.page;
      const rows = $event.rows ?? 10;
      this.getExpensePage(page, rows, 'date');
    } else {
      console.error('Page event is missing or undefined');
    }
  }

  async openModal() {
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
    

    const body = {
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

        this.expensesList.unshift(response); 
        this.modalService.close();
        this.newExpenseForm.reset();
        this.pagination.totalRecords += 1; 
      },
      (error: any) => {
        console.error(error);
        this.error = error;
        this.modalService.updateChildInputs({ responseError: this.error });
      }
    );
  }
  async openEditModal(expense: Expense){
    this.newExpenseForm.get("name")?.setValue(expense.name)
    this.newExpenseForm.get("amount")?.setValue(expense.amount)
    this.newExpenseForm.get("description")?.setValue(expense.description)
    this.newExpenseForm.get("frequency")?.setValue(expense.frequency)
    this.newExpenseForm.get("category")?.setValue(expense.category.id)
    this.newExpenseForm.get("project")?.setValue(expense.projectId ?? '')
    this.newExpenseForm.get("date")?.setValue(expense.date)
    this.newExpenseForm.get("image")?.setValue(expense.image)
    const modalRef = await this.modalService.open(QuickaccessModalComponent, {type: "expense", isUpdate: true}, "UPDATE EXPENSE")
    modalRef.instance.submit.subscribe((data: any) => {
      this.patchExpense(expense.id)
    })

  }
  patchExpense(id: number){
    const name = this.newExpenseForm.get("name")?.value;
    const description = this.newExpenseForm.get("description")?.value;
    const amount = this.newExpenseForm.get("amount")?.value;
    const frequency = this.newExpenseForm.get("frequency")?.value;
    const category = this.newExpenseForm.get("category")?.value;
    const project = this.newExpenseForm.get("project")?.value;
    const image = this.newExpenseForm.get("image")?.value;
    const date = formatDate(this.newExpenseForm.get("date")?.value, "yyyy-MM-dd", "en-US")

    const body: PostExpenseRequest = {
      name: name,
      description: description,
      amount: amount, 
      frequency: frequency,
      categoryId: category,
      projectId: project >= 0 ? project : null,
      date: date,
      image: image
    }
    this.roleService.patchExpense(body, id)
      .subscribe((response: Expense) => {
        const index = this.expensesList.findIndex((exp: Expense) => exp.id === id)
        this.expensesList.splice(index,1)
        this.expensesList.push(response)
        this.modalService.close();

      },(error: any) => {
        console.error(error)
      })
  }

  showFilterSelect() {
    this._isSelectVisible = !this._isSelectVisible;
    if (!this._isSelectVisible) {
      this.getExpensePageWithFilters();
    }
  }

  changeDirection() {
    const newDirection = this.filterForm.get("direction")?.value === "ASC" ? "DESC" : "ASC";
    this.filterForm.get("direction")?.setValue(newDirection);
    this.getExpensePageWithFilters();
  }

  getExpensePageWithFilters() {
    const orderBy = this.filterForm.get('orderBy')?.value || 'date';
    const direction = this.filterForm.get('direction')?.value || 'ASC';
    this.getExpensePage(0, this.pagination.rows, orderBy, direction);
  }
 
  allowUpdate(){
    this._isUpdateAllowed = !this._isUpdateAllowed;
  }
  async openDeleteModal(id: number){
    const modalRef = await this.modalService.open(OptionModalComponent, {
      title: "Are you sure you want to delete the expense? ",
      subtitle: "the action is irreversible",
      description: ""
    }, "DELETE EXPENSE")
    modalRef.instance.confirm.subscribe((data: any) => {
      this.deleteExpense(id)
    })
    modalRef.instance.cancel.subscribe((data: any) => this.modalService.close())
  }


  isExpired(date: string) {
    return new Date(date) <= new Date();
  }

  deleteExpense(id: number){
    this.roleService.deleteExpense(id)
      .subscribe((response: any) => {
        this.modalService.close()
        this.getExpensePage()
      } ,(error: any) => {
          console.error(error)
      })
  }
}
