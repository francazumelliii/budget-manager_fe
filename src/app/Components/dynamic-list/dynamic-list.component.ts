import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Expense, Income } from '../../Interfaces/interface';

@Component({
  selector: 'app-dynamic-list',
  templateUrl: './dynamic-list.component.html',
  styleUrl: './dynamic-list.component.sass'
})
export class DynamicListComponent implements OnInit{

  @Output() expand = new EventEmitter<'EXPENSE' | 'INCOME'>();
  @Output() toggle = new EventEmitter<boolean>();
  @Input() list:any = []
  @Input() defaultCurrency:any = "€"
  @Input() defaultOpened: boolean = true;
  @Input() template: "INCOME" | "EXPENSE" = "EXPENSE"
  isOpened: boolean = false;


  ngOnInit(): void {
    this.isOpened = this.defaultOpened
  }

  frequency: any = {
    "S": "Single",
    "W": "Weekly",
    "M": "Monthly",
    "Y": "Annual"
  }

  emitClickEvent(type: "EXPENSE" | "INCOME"){
    this.expand.emit(type);
    console.log("EMIT CLICK")
  }
  switchView(){
    this.isOpened = !this.isOpened
  }


}