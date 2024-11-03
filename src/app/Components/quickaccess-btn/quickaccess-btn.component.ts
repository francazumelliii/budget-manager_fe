import { Component, Input, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-quickaccess-btn',
  templateUrl: './quickaccess-btn.component.html',
  styleUrl: './quickaccess-btn.component.sass'
})
export class QuickaccessBtnComponent {
  @Input() label: string = ""
  @Input() icon: string = ""
  @Input() iconBgColor: string = ""
  @Output() click = new EventEmitter();

  emitClickEvent(){
    this.click.emit("")
  }


}
