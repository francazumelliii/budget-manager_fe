import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroupService } from '../../Services/form-group.service';
import { AuthenticationService } from '../../Services/authentication.service';
import { FormGroup } from '@angular/forms';
import { ModalService } from '../../Services/modal.service';
import { OptionModalComponent } from '../option-modal/option-modal.component';

@Component({
  selector: 'app-account-modal',
  templateUrl: './account-modal.component.html',
  styleUrl: './account-modal.component.sass',
})
export class AccountModalComponent {
  form!: FormGroup;
  constructor(
    private formService: FormGroupService,
    public authService: AuthenticationService,
    private modalService: ModalService
  ) {
    this.form = this.formService.signupForm;
  }

  @Output() onDelete: EventEmitter<any> = new EventEmitter<any>();
  @Output() onSave: EventEmitter<any> = new EventEmitter<any>();
  @Output() onSwitch: EventEmitter<any> = new EventEmitter<any>();

  defaultCurrencies: { name: string; id: string }[] = [
    { name: 'Euro (€)', id: '€' },
    { name: 'US Dollar ($)', id: '$' },
    { name: 'British Pound (£)', id: '£' },
    { name: 'Japanese Yen (¥)', id: '¥' },
    { name: 'Indian Rupee (₹)', id: '₹' },
    { name: 'Bitcoin (₿)', id: '₿' },
    { name: 'Russian Ruble (₽)', id: '₽' },
    { name: 'South Korean Won (₩)', id: '₩' },
    { name: 'Brazilian Real (R$)', id: 'R$' },
    { name: 'Canadian Dollar (C$)', id: 'C$' },
    { name: 'Australian Dollar (A$)', id: 'A$' },
    { name: 'Swiss Franc (CHF)', id: 'CHF' },
    { name: 'Hong Kong Dollar (HK$)', id: 'HK$' },
    { name: 'Chinese Yuan (¥CN)', id: '¥CN' },
    { name: 'Turkish Lira (₺)', id: '₺' },
    { name: 'Saudi Riyal (SAR)', id: 'SAR' },
    { name: 'UAE Dirham (AED)', id: 'AED' },
    { name: 'South African Rand (ZAR)', id: 'ZAR' },
    { name: 'Singapore Dollar (SG$)', id: 'SG$' },
    { name: 'New Zealand Dollar (NZ$)', id: 'NZ$' },
  ];

  ngOnInit() {
    this.valorizeForm();
  }

  valorizeForm() {
    this.form.get('name')?.setValue(this.authService.userInformation.name);
    this.form.get('surname')?.setValue(this.authService.userInformation.surname);
    this.form.get('email')?.setValue(this.authService.userInformation.email);
    this.form.get('email')?.disable();
    this.form.get("currency")?.setValue(this.authService.defaultCurrency)
    this.form
      .get('birthdate')
      ?.setValue(this.authService.userInformation.birthdate);
    this.form.get('birthdate')?.disable();
  }

  async openConfirmModal(type: 'delete' | 'switch') {
    if (type === 'delete') {
      const modalRef = await this.modalService.open(
        OptionModalComponent,
        {
          title: 'Are you sure? ',
          subtitle: 'the action is irreversible',
          description: '',
        },
        'CONFIRM DELETE? '
      );
      modalRef.instance.confirm.subscribe((data: any) => {
        this.onDelete.emit('');
      });
      modalRef.instance.cancel.subscribe((data: any) =>
        this.modalService.close()
      );
    }
  }
}
