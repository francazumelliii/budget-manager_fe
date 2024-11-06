import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Expense, Income } from '../../Interfaces/interface';

@Component({
  selector: 'app-dynamic-list',
  templateUrl: './dynamic-list.component.html',
  styleUrl: './dynamic-list.component.sass'
})
export class DynamicListComponent {

  @Output() click = new EventEmitter<'EXPENSE' | 'INCOME'>();
  @Input() list:any = []
  @Input() template: "INCOME" | "EXPENSE" = "EXPENSE"

  frequency: any = {
    "S": "Single",
    "W": "Weekly",
    "M": "Monthly",
    "Y": "Annual"
  }

  emitClickEvent(type: "EXPENSE" | "INCOME"){
    this.click.emit(type);
  }


}