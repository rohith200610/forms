import { Component, HostListener } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  isDropdownOpen = false;

  constructor(private router: Router) {}

  toggleDropdown(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown() {
    this.isDropdownOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    this.isDropdownOpen = false;
  }

  logout() {
    // Clear any authentication data here
    console.log('Logging out...');
    this.closeDropdown();
    this.router.navigate(['/login']);
  }
}
