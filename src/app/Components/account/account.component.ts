import { Component, Input, Output } from '@angular/core';
import { AuthenticationService } from '../../Services/authentication.service';
import {
  AuthResponse,
  Friend,
  MonthlyStats,
  User,
} from '../../Interfaces/interface';
import { RoleService } from '../../Services/role.service';
import { formatDate } from '@angular/common';
import { ModalService } from '../../Services/modal.service';
import { AccountModalComponent } from '../account-modal/account-modal.component';
import { FormGroupService } from '../../Services/form-group.service';
import { FormGroup } from '@angular/forms';
import { OptionModalComponent } from '../option-modal/option-modal.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrl: './account.component.sass',
})
export class AccountComponent {
  user!: User;
  patchForm!: FormGroup;
  constructor(
    public authService: AuthenticationService,
    private roleService: RoleService,
    private modalService: ModalService,
    private formService: FormGroupService
  ) {
    this.user = this.authService.userInformation;
    this.patchForm = this.formService.signupForm;
  }
  monthlyStats: any[] = [];
  totalIncomes: number = 0;
  _isEditAllowed: boolean = false
  percentage: number = 0;
  friends: Friend[] = [];

  ngOnInit(): void {
    this.getMonthlyStats();
    this.getAllFriends();
  }

  getMonthlyStats() {
    const date = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
    this.roleService.monthlyStats(date).subscribe(
      (response: MonthlyStats) => {
        this.monthlyStats = [
          { name: 'This Month Expenses', value: response.totalExpense },
        ];
        this.totalIncomes = response.totalIncome;

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

  getAllFriends() {
    this.roleService.getFriends().subscribe(
      (response: Friend[]) => {
        this.friends = response;
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  async openSettingsModal() {
    const modalRef = await this.modalService.open(
      AccountModalComponent,
      {},
      'UPDATE ACCOUNT'
    );
    modalRef.instance.onDelete.subscribe((data: any) => {
      this.deleteAccount()
    });

    modalRef.instance.onSave.subscribe((data: any) => {
      this.patchAccount();
    });

    modalRef.instance.onSwitch.subscribe((data: any) => {
      this.switchToParent();
    });

    modalRef.instance.onExport.subscribe((data: any) => {
      this.exportData();
    });
  }

 

  patchAccount() {
    const name = this.patchForm.get('name')?.value;
    const surname = this.patchForm.get('surname')?.value;
    const currency = this.patchForm.get('currency')?.value;
    const body = {
      name: name,
      surname: surname,
      defaultCurrency: currency,
    };
    this.roleService.patchAccount(body).subscribe(
      (response: User) => {
        this.user = response;
        this.authService.storeUserInformation(response);
        this.authService.setDefaultCurrency(response.defaultCurrency);
        this.modalService.close();
      },
      (error: any) => {
        console.error(error);
      }
    );
  }
  switchToParent() {
    this.roleService.switchToParent().subscribe(
      (response: AuthResponse) => {
        this.authService.storeToken(response.jwt);
        this.authService.storeUserInformation(response.user);
        this.authService.emitRoleSwitch();
        this.modalService.close();
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  deleteAccount() {
    console.log("delete")
    this.roleService.deleteAccount().subscribe(
      (response: any) => {
        console.log("Successfully deleted")
        this.modalService.close();
        this.authService.logOut();
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  openAvatarModal() {
    
  }
  

  exportData() {
    console.log("EXPORTING")
    this.roleService.exportData().subscribe(
      (blob: Blob) => {
        const link = document.createElement('a');
        const url = window.URL.createObjectURL(blob);
        link.href = url;
        link.download = 'user_data.xlsx';
        link.click();
        window.URL.revokeObjectURL(url);
        this.modalService.close()
      },
      (error: any) => {
        this.modalService.updateChildInputs({responseError: "Download error... try later"})
        console.error('Download error:', error);
      }
    );
  }
}
