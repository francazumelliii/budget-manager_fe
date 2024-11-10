import { Component, OnInit } from '@angular/core';
import { RoleService } from '../../Services/role.service';
import { Expense, Page, Pagination } from '../../Interfaces/interface';
import { PaginatorState } from 'primeng/paginator';
import { FormGroupService } from '../../Services/form-group.service';
import { FormGroup } from '@angular/forms';
import { ModalService } from '../../Services/modal.service';
import { QuickaccessModalComponent } from '../quickaccess-modal/quickaccess-modal.component';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.sass'] // Corretto il nome del file styleUrls
})
export class ExpenseComponent implements OnInit {
  constructor(
    private roleService: RoleService,
    private formService: FormGroupService,
    private modalService: ModalService
    ) {

    }

  expensesList: Expense[] = [];
  error: string = ""
  pagination: Pagination = {
    rows: 10,
    first: 0,
    rowsPerPageOptions: [10, 15, 20],
    totalRecords: 0
  };
  newExpenseForm: FormGroup = this.formService.newExpenseForm

  ngOnInit(): void {
    this.getExpensePage(1, this.pagination.rows, 'date');
  }

  getExpensePage(page: number, size: number, order: string = 'date'): void {
    this.roleService.allExpensesPaging(page, size, order).subscribe(
      (response: Page<Expense>) => {
        this.expensesList = response.records;
        this.pagination = {
          rows: size,
          first: (page - 1) * size,
          rowsPerPageOptions: [5, 10, 15],
          totalRecords: response.totalRecords
        };
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  handlePageChange($event: PaginatorState): void {
    if ($event && $event.page !== undefined) {

      const page = $event.page + 1;  
      const rows = $event.rows ?? 10; 
      this.getExpensePage(page, rows, 'date');
    } else {
      console.error("Page event is missing or undefined");
    }
  }
  async openModal(){
    const componentRef = await this.modalService.open(QuickaccessModalComponent, {type: "expense", responseError: this.error}, "NEW EXPENSE")
    componentRef.instance.submit.subscribe((data: any) => this.addNewExpense() )
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

    const body = {
      name: name,
      amount: amount,
      description: description,
      frequency: frequency,
      categoryId: category,
      projectId: project,
      image: image,
      date: formatDate(date, "yyyy-MM-dd", "en-US")
    }

    this.roleService.postExpense(body)
      .subscribe((response: Expense) => {
        this.expensesList.push(response);
        this.expensesList.pop()
        this.modalService.close()
        this.newExpenseForm.reset()
      },(error: any) => {
        console.error(error), 
        this.error = error;
        this.modalService.updateChildInputs({responseError: this.error})
      })
  }
}
