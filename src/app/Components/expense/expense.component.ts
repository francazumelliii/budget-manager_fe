import { Component, OnInit } from '@angular/core';
import { RoleService } from '../../Services/role.service';
import { Expense, Page, Pagination } from '../../Interfaces/interface';
import { PaginatorState } from 'primeng/paginator';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.sass'] // Corretto il nome del file styleUrls
})
export class ExpenseComponent implements OnInit {
  constructor(private roleService: RoleService) {}

  expensesList: Expense[] = [];
  pagination: Pagination = {
    rows: 10,
    first: 0,
    rowsPerPageOptions: [10, 15, 20],
    totalRecords: 0
  };

  ngOnInit(): void {
    // Chiamata iniziale per caricare la prima pagina
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
  
}
