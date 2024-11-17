import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  constructor(private messageService: MessageService) {}

  show(list: { severity: string; summary: string; detail: string }[]) {
    this.messageService.addAll(list);
  }
  clear() {
    this.messageService.clear();
}
}
