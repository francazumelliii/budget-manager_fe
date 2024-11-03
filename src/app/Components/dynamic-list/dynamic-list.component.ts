import { Component, Input } from '@angular/core';
import { Expense, Income } from '../../Interfaces/interface';

@Component({
  selector: 'app-dynamic-list',
  templateUrl: './dynamic-list.component.html',
  styleUrl: './dynamic-list.component.sass'
})
export class DynamicListComponent {


  @Input() list:any = []
  @Input() template: "INCOME" | "EXPENSE" = "EXPENSE"

  frequency: any = {
    "S": "Single",
    "W": "Weekly",
    "M": "Monthly",
    "Y": "Annual"
  }


}