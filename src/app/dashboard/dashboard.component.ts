import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  constructor(private router: Router) {}

  navigateToExpenses() {
    this.router.navigate(['/expense-list']);
  }

  navigateToAddExpense() {
    this.router.navigate(['/expense-list'], { 
      queryParams: { showAddForm: 'true' } 
    });
  }

  navigateToMonthlySummary() {
    this.router.navigate(['/monthly-summary']);
  }

  navigateToSpendingOverview() {
    this.router.navigate(['/spending-overview']);
  }

  navigateToMonthSummary() {
    this.router.navigate(['/month-summary']);
  }
}
