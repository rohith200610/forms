import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-monthly-summary',
  imports: [CommonModule, FormsModule],
  templateUrl: './monthly-summary.component.html',
  styleUrl: './monthly-summary.component.css'
})
export class MonthlySummaryComponent {
  isEditMode: boolean = false;
  isDetailEditMode: boolean = false;

  // Main totals
  totalIncome: number = 20000;
  totalExpenses: number = 12500;

  // Income breakdown
  salaryAmount: number = 18000;
  freelanceAmount: number = 2000;

  // Expense breakdown
  rentAmount: number = 8000;
  foodAmount: number = 3000;
  transportAmount: number = 1500;

  get remaining(): number {
    return this.totalIncome - this.totalExpenses;
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
    if (!this.isEditMode) {
      console.log('Main totals saved!');
      console.log('Total Income:', this.totalIncome);
      console.log('Total Expenses:', this.totalExpenses);
      console.log('Remaining:', this.remaining);
    }
  }

  toggleDetailEdit() {
    this.isDetailEditMode = !this.isDetailEditMode;
    if (!this.isDetailEditMode) {
      // Update totals based on breakdown
      this.totalIncome = this.salaryAmount + this.freelanceAmount;
      this.totalExpenses = this.rentAmount + this.foodAmount + this.transportAmount;
      console.log('Detail breakdown saved!');
    }
  }
}
