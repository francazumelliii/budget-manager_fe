import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormControl, FormControlName, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrl: './select.component.sass'
})
export class SelectComponent   
 {
  @Input() noneAvailable: boolean = false;
  @Input() list: any[] = [];
  @Input() selected!: any
  @Input() label: string = "Select an option..";
  @Input() control!: AbstractControl;
  @Output() change = new EventEmitter<any>()
  get ctrl() {
    return this.control as FormControl;
  }

  ngOnInit(){
    
  }

}
