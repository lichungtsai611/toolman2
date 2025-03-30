import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  isMobileMenuOpen: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  changeLanguage(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedLanguage = selectElement.value;
    
    // 這裡可以調用語言服務進行語言切換
    console.log('語言已切換為：', selectedLanguage);
    
    // 可以在這裡實現記住用戶語言偏好的邏輯
    localStorage.setItem('preferred-language', selectedLanguage);
  }
}
