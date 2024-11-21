import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-option-modal',
  templateUrl: './option-modal.component.html',
  styleUrl: './option-modal.component.sass'
})
export class OptionModalComponent {

  @Input() title: string = ""
  @Input() subtitle: string = ""
  @Input() description: string = ""
  @Input() confirmLabel: string = "CONFIRM"
  @Input() cancelLabel: string = "CANCEL"
  @Output() confirm = new EventEmitter<any>()
  @Output() cancel = new EventEmitter<any>()
}
