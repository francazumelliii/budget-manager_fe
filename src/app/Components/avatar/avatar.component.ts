import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.sass'
})
export class AvatarComponent {
  @Input() name: string = "User User"
  @Input() type: string = "pixel-art"
  
  generateAvatar(name: string ,type :string){
    return `https://api.dicebear.com/6.x/${type}/svg?seed=${encodeURIComponent(name)}`
  }
  
}
