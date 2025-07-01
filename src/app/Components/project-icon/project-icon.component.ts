import { Component, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-project-icon',
  templateUrl: './project-icon.component.html',
  styleUrl: './project-icon.component.sass'
})
export class ProjectIconComponent {

  @Output() iconClick: EventEmitter<any> = new EventEmitter()
}
