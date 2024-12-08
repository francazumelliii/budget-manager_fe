import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PaginatorState } from 'primeng/paginator';
import { Pagination } from '../../Interfaces/interface';


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrl: './table.component.sass',
})
export class TableComponent {
  @Input() showPaginator: boolean = true;
  @Input() fullHeight: boolean = true;
  @Input() height: string = "85vh";
  @Output() pageChange = new EventEmitter<PaginatorState>()
  @Input() pagination: Pagination = {
    rows: 10,
    first: 0,
    rowsPerPageOptions: [10,15,20],
    totalRecords: 100
  }

  onPageChange(event: PaginatorState) {
    console.log(event)
    this.pageChange.emit(event)
  }
}
