import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '../../Classes/user';
import { SimpleAccount } from '../../Interfaces/interface';

@Component({
  selector: 'app-account-icon-complete',
  templateUrl: './account-icon-complete.component.html',
  styleUrl: './account-icon-complete.component.sass'
})
export class AccountIconCompleteComponent {
  @Input() account!: any
  @Input() type: "REMOVE" | "ADD" = "REMOVE"
  @Output() buttonClick =  new EventEmitter<any>()
}
