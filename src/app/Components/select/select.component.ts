import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrl: './select.component.sass'
})
export class SelectComponent {
  @Input() list: any[] = []
  @Input() label: string = "Select an option.."

}
