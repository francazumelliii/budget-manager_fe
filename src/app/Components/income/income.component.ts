import { Component, Input } from '@angular/core';
import { PaginatorState } from 'primeng/paginator';
import { Expense, Income, Page, Pagination, PostIncomeRequest } from '../../Interfaces/interface';
import { QuickaccessModalComponent } from '../quickaccess-modal/quickaccess-modal.component';
import { formatDate } from '@angular/common';
import { RoleService } from '../../Services/role.service';
import { FormGroupService } from '../../Services/form-group.service';
import { ModalService } from '../../Services/modal.service';
import { FormGroup } from '@angular/forms';
import { AuthenticationService } from '../../Services/authentication.service';
import { OptionModalComponent } from '../option-modal/option-modal.component';

@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrl: './income.component.sass'
})
export class IncomeComponent {
  constructor(
    private roleService: RoleService,
    private formService: FormGroupService,
    private modalService: ModalService,
    public authService: AuthenticationService
  ) {}

  @Input() childId: number | null = null;
  incomesList: Income[] = [];
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
  newIncomeForm: FormGroup = this.formService.newIncomeForm;

  ngOnInit(): void {
    if (this.incomesList.length === 0) {
      this.getIncomePage(0, this.pagination.rows, 'date', 'ASC');
    }
  }
  
  ngOnChanges() {

    if (this.incomesList) {
      this.getIncomePageWithFilters();
    }
  }

  getIncomePage(
    page: number = 0,
    size: number = 10,
    order: string | null = null,
    direction: string | null = null
  ): void {
    const sortOrder = order ?? 'date';
    const sortDirection = direction ?? 'ASC';

    this.roleService
      .allIncomesPaging(this.childId, page, size, sortOrder, sortDirection)
      .subscribe(
        (response: Page<Income>) => {
          this.incomesList = response.records;
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

  allowUpdate(){
    this._isUpdateAllowed = !this._isUpdateAllowed;
  }

  async openDeleteModal(id: number){
    const modalRef = await this.modalService.open(OptionModalComponent, {
      title: "Are you sure you want to delete the income? ",
      subtitle: "the action is irreversible",
      description: ""
    }, "DELETE INCOME")
    modalRef.instance.confirm.subscribe((data: any) => {
      this.deleteIncome(id)
    })
    modalRef.instance.cancel.subscribe((data: any) => this.modalService.close())
  }


  deleteIncome(id: number){
    this.roleService.deleteIncome(id)
      .subscribe((response: any) => {
        const index = this.incomesList.findIndex((inc: Income) => inc.id === id)
        this.incomesList.splice(index,1)
        this.modalService.close()
      }, (error: any)=> {
        console.error(error)
      })
  }

  handlePageChange($event: PaginatorState): void {
    if ($event && $event.page !== undefined) {
      const page = $event.page;
      const rows = $event.rows ?? 10;
      this.getIncomePage(page, rows, 'date', 'ASC');
    } else {
      console.error('Page event is missing or undefined');
    }
  }

  async openModal() {
    const componentRef = await this.modalService.open(
      QuickaccessModalComponent,
      { type: 'income', responseError: this.error },
      'NEW INCOME'
    );
    componentRef.instance.submit.subscribe((data: any) => this.addNewIncome());
  }

  addNewIncome() {
    const name = this.newIncomeForm.get('name')?.value;
    const description = this.newIncomeForm.get('description')?.value;
    const amount = this.newIncomeForm.get('amount')?.value;
    const frequency = this.newIncomeForm.get('frequency')?.value;
    const date = this.newExpenseForm.get('date')?.value;
    const image = this.newIncomeForm.get('image')?.value;

    const body: PostIncomeRequest = {
      name: name,
      description: description,
      amount: amount,
      date: date ? formatDate(date, 'yyyy-MM-dd', 'en-US') : formatDate(new Date(), "yyyy-MM-dd", "en-US"),
      frequency: frequency,
      image: image
    };

    this.roleService.postIncome(body).subscribe(
      (response: Income) => {

        this.incomesList.unshift(response); 
        this.modalService.close();
        this.newIncomeForm.reset();
      },
      (error: any) => {
        console.error(error);
        this.error = error;
        this.modalService.updateChildInputs({ responseError: this.error });
      }
    );
  }

  async openEditModal(income: Income){

    this.newIncomeForm.get("name")?.setValue(income.name)
    this.newIncomeForm.get("description")?.setValue(income.description)
    this.newIncomeForm.get("amount")?.setValue(income.amount)
    this.newIncomeForm.get("image")?.setValue(income.image)
    this.newIncomeForm.get("frequency")?.setValue(income.frequency)
    this.newIncomeForm.get("date")?.setValue(income.date)

    const modalRef = await this.modalService.open(QuickaccessModalComponent, {type:"income", isUpdate: true}, "UPDATE INCOME")
    modalRef.instance.submit.subscribe((data :any) => {
      this.patchIncome(income.id)
    })

  }

  patchIncome(id: number){
    const name = this.newIncomeForm.get("name")?.value;
    const description = this.newIncomeForm.get("description")?.value;
    const amount = this.newIncomeForm.get("amount")?.value;
    const image = this.newIncomeForm.get("image")?.value;
    const frequency = this.newIncomeForm.get("frequency")?.value;
    const date = formatDate(this.newIncomeForm.get("date")?.value, "yyyy-MM-dd", "en-US");

    const body: PostIncomeRequest = {
      name: name,
      description: description,
      amount: amount,
      image: image,
      date: date, 
      frequency: frequency
    }
    this.roleService.patchIncome(body, id)
      .subscribe((response: Income) => {
        const index = this.incomesList.findIndex((income: Income) => income.id === id)
        this.incomesList.slice(index,1)
        this.incomesList.push(response)
        this.modalService.close()
      },(error: any)=> {
        console.error(error)
      })

  }


  showFilterSelect() {
    this._isSelectVisible = !this._isSelectVisible;
    if (!this._isSelectVisible) {
      this.getIncomePageWithFilters();
    }
  }

  changeDirection() {
    const newDirection = this.filterForm.get('direction')?.value === 'ASC' ? 'DESC' : 'ASC';
    this.filterForm.get('direction')?.setValue(newDirection);
    this.getIncomePageWithFilters();
  }

  getIncomePageWithFilters() {
    const orderBy = this.filterForm.get('orderBy')?.value || 'date';
    const direction = this.filterForm.get('direction')?.value || 'ASC';
    this.getIncomePage(0, this.pagination.rows, orderBy, direction);
  }

  isExpired(date: string) {
    return new Date(date) <= new Date();
  }
}
