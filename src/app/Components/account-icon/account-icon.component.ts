import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-account-icon',
  templateUrl: './account-icon.component.html',
  styleUrl: './account-icon.component.sass'
})
export class AccountIconComponent {
  @Input() name: string = "user"
  @Input() size: string = ""

  getImage(name: string){
    return `https://ui-avatars.com/api/?name=${name}&background=random`
  }
}
