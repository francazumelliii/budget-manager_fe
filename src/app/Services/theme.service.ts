import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private darkMode = false;

  constructor() {
    this.initTheme();
  }


  initTheme() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.darkMode = prefersDark;
    document.documentElement.classList.toggle('dark', prefersDark);
  }


  toggleTheme() {
    this.darkMode = !this.darkMode;
    document.documentElement.classList.toggle('dark', this.darkMode);
    localStorage.setItem('theme', this.darkMode ? 'dark' : 'light');
  }


  isDarkMode(): boolean {
    return this.darkMode;
  }
}
