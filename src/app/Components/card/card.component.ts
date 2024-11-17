import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '../../Interfaces/interface';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.sass'
})
export class CardComponent {
  @Input() user!: User 
  @Output() click: any = new EventEmitter<any>()

}
