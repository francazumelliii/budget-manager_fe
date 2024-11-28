import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Expense, Project, SimpleAccount } from '../../Interfaces/interface';

@Component({
  selector: 'app-choose-person-modal',
  templateUrl: './choose-person-modal.component.html',
  styleUrl: './choose-person-modal.component.sass',
})
export class ChoosePersonModalComponent {
  @Input() expense!: Expense;
  @Input() project!: Project;
  @Output() buttonClick = new EventEmitter<any>();

  sharedAccount: SimpleAccount[] = [];
  nonSharedAccount: SimpleAccount[] = [];
  error: string = '';

  ngOnInit() {
    this.divideAccounts();
  }
  divideAccounts() {
    this.sharedAccount = [...this.expense.participants];

    const sharedEmails = new Set(this.sharedAccount.map((acc) => acc.email));

    const creatorEmail = this.project.creator?.email;

    this.nonSharedAccount = this.project.accounts.filter(
      (a) =>
        !sharedEmails.has(a.email) &&
        (a.email !== creatorEmail ||
          creatorEmail === undefined ||
          !sharedEmails.has(creatorEmail)) 
    );
    if(!sharedEmails.has(creatorEmail)) this.nonSharedAccount.push(this.project.creator)
  }

  removeFromShared(account: any) {
    if (this.sharedAccount.length <= 1) {
      this.error = 'At least 1 account must join the expense';
      return;
    }
    this.error = '';
    this.sharedAccount.splice(this.sharedAccount.indexOf(account), 1);
    this.nonSharedAccount.push(account);
  }
  addToShared(account: any) {
    this.sharedAccount.length >= 1 ? (this.error = '') : null;
    this.nonSharedAccount.splice(this.nonSharedAccount.indexOf(account), 1);
    this.sharedAccount.push(account);
  }
}
