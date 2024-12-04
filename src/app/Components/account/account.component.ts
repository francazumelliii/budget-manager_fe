import { Component, Input } from '@angular/core';
import { AuthenticationService } from '../../Services/authentication.service';
import { Friend, MonthlyStats, SimpleAccount, User } from '../../Interfaces/interface';
import { RoleService } from '../../Services/role.service';
import { formatDate } from '@angular/common';
import { ModalService } from '../../Services/modal.service';
import { AccountModalComponent } from '../account-modal/account-modal.component';
import { FormGroupService } from '../../Services/form-group.service';
import { FormGroup } from '@angular/forms';
import { OptionModalComponent } from '../option-modal/option-modal.component';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrl: './account.component.sass'
})
export class AccountComponent {

  user!:User
  patchForm !: FormGroup
  constructor(
    public authService: AuthenticationService,
    private roleService: RoleService,
    private modalService: ModalService,
    private formService: FormGroupService
    ){
    this.user = this.authService.userInformation
    this.patchForm = this.formService.signupForm
  
  }
  monthlyStats: any[] = []
  totalIncomes: number = 0;
  percentage: number = 0;
  friends: Friend[] = [] 




  ngOnInit(): void {
   this.getMonthlyStats()
   this.getAllFriends()
  }

  getMonthlyStats() {
    const date = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
    this.roleService.monthlyStats(date).subscribe(
      (response: MonthlyStats) => {
        this.monthlyStats = [
          { name: 'This Month Expenses', value: response.totalExpense },
        ];
        this.totalIncomes = response.totalIncome

        this.calculatePercentage(response);
      },
      (error: any) => {
        console.error(error);
      }
    );
  }
  calculatePercentage(item: MonthlyStats) {
    const totalExpense = item.totalExpense != null ? item.totalExpense : 0;
    const totalIncome = item.totalIncome != null ? item.totalIncome : 0;
    this.percentage = (totalExpense / totalIncome) * 100;
  }

  getAllFriends(){
    this.roleService.getFriends()
      .subscribe((response: Friend[]) => {
        this.friends = response;
      },(error: any) => {
        console.error(error)
      })
  }

  async openSettingsModal(){
    const modalRef = await this.modalService.open(AccountModalComponent, {}, "UPDATE ACCOUNT")
    modalRef.instance.onDelete.subscribe((data: any) => {
      this.openConfirmModal()
    })

    modalRef.instance.onSave.subscribe((data: any) => {
      this.patchAccount()
    })

    modalRef.instance.onSwitch.subscribe((data: any) => {
      this.switchToParent()
    })
  }

  openConfirmModal(){
    this.roleService.deleteAccount()
      .subscribe(async (response: any) => {
        const modalRef = await this.modalService.open(OptionModalComponent, {
          title: "Are you sure you want to delete your account? ",
          subtitle: "This option is irreversible",
          description: "",
          confirmLabel: "CONFIRM",
          cancelLabel: "CANCEL"
        }, "DELETE ACCOUNT")
        modalRef.instance.confirm.subscribe((data: any) => {
          this.deleteAccount()
        })
        modalRef.instance.cancel.subscribe((data: any) => {
          this.modalService.close();
        })
        

      }, (error: any) => {
        console.log(error)
      })
  }

  patchAccount(){
    const name = this.patchForm.get("name")?.value;
    const surname = this.patchForm.get("surname")?.value;
    const currency = this.patchForm.get("currency")?.value;
    const body = {
      name: name,
      surname: surname, 
      defaultCurrency: currency
    }
    this.roleService.patchAccount(body)
      .subscribe((response: User) => {
        this.user = response
        this.authService.storeUserInformation(response)
        this.authService.setDefaultCurrency(response.defaultCurrency)
        this.modalService.close()
      },(error: any) => {
        console.error(error)
      })
  }
  switchToParent(){
    // TODO implement
  }

  deleteAccount(){
    this.roleService.deleteAccount()
      .subscribe((response: any) => {
        this.modalService.close()
        this.authService.logOut()
      },(error: any)=> {
        console.error(error)
      })
  }

}
