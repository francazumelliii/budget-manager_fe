import { Component, Input } from '@angular/core';
import { AbstractControl, FormControl, FormControlName, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrl: './select.component.sass'
})
export class SelectComponent   
 {
  @Input() list: any[] = [];
  @Input() label: string = "Select an option..";
  @Input() control!: AbstractControl;
  get ctrl() {
    return this.control as FormControl;
  }
}