import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../Services/database.service';
import { RoleService } from '../../Services/role.service';
import { Category, Expense, Income } from '../../Interfaces/interface';
import { ModalService } from '../../Services/modal.service';
import { QuickaccessModalComponent } from '../quickaccess-modal/quickaccess-modal.component';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.sass'
})
export class HomepageComponent implements OnInit{

  constructor(
    private dbService: DatabaseService,
    private roleService: RoleService,
    private modalService: ModalService
  ){}

  recentExpensesList: Expense[] = []
  recentIncomesList: Income[] = []
  


  ngOnInit(){
    this.getLastMonthExpenses();
    this.getLastMonthIncomes()
  }

  getLastMonthExpenses(){
    this.roleService.lastMonthExpenses(6)
      .subscribe((response: Expense[]) => {
        this.recentExpensesList = response
      }, (error: any) => {
        console.error("error: ", error)
      })
  }

  getLastMonthIncomes(){
    this.roleService.lastMonthIncomes(6)
      .subscribe((response: Income[]) => {
        this.recentIncomesList = response
      },(error: any) => {
        console.error("error", error)
      })
  }

  async openModal(type: string){
    this.modalService.open(QuickaccessModalComponent, {type: type}, `NEW ${type}`)
  }
}
