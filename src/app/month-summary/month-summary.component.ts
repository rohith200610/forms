import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface MonthData {
  month: string;
  shortMonth: string;
  amount: number;
  color: string;
  isCurrentMonth?: boolean;
}

@Component({
  selector: 'app-month-summary',
  imports: [CommonModule, FormsModule],
  templateUrl: './month-summary.component.html',
  styleUrl: './month-summary.component.css'
})
export class MonthSummaryComponent {
  isEditMode: boolean = false;
  currentYear: number = new Date().getFullYear();
  currentMonth: number = new Date().getMonth() + 1; // JavaScript months are 0-indexed
  
  // Helper method to determine amount based on month status
  getMonthAmount(monthNumber: number, plannedAmount: number): number {
    if (monthNumber < this.currentMonth) {
      // Past months - return the actual amount
      return plannedAmount;
    } else if (monthNumber === this.currentMonth) {
      // Current month - return partial amount or full if month is complete
      return plannedAmount;
    } else {
      // Future months - return 0
      return 0;
    }
  }
  
  monthlyData: MonthData[] = [
    { month: 'January', shortMonth: 'Jan', amount: this.getMonthAmount(1, 18500), color: '#3498db', isCurrentMonth: this.currentMonth === 1 },
    { month: 'February', shortMonth: 'Feb', amount: this.getMonthAmount(2, 19200), color: '#e74c3c', isCurrentMonth: this.currentMonth === 2 },
    { month: 'March', shortMonth: 'Mar', amount: this.getMonthAmount(3, 17800), color: '#2ecc71', isCurrentMonth: this.currentMonth === 3 },
    { month: 'April', shortMonth: 'Apr', amount: this.getMonthAmount(4, 20500), color: '#f39c12', isCurrentMonth: this.currentMonth === 4 },
    { month: 'May', shortMonth: 'May', amount: this.getMonthAmount(5, 19800), color: '#9b59b6', isCurrentMonth: this.currentMonth === 5 },
    { month: 'June', shortMonth: 'Jun', amount: this.getMonthAmount(6, 18900), color: '#1abc9c', isCurrentMonth: this.currentMonth === 6 },
    { month: 'July', shortMonth: 'Jul', amount: this.getMonthAmount(7, 20000), color: '#34495e', isCurrentMonth: this.currentMonth === 7 },
    { month: 'August', shortMonth: 'Aug', amount: this.getMonthAmount(8, 0), color: '#e67e22', isCurrentMonth: this.currentMonth === 8 },
    { month: 'September', shortMonth: 'Sep', amount: this.getMonthAmount(9, 0), color: '#95a5a6', isCurrentMonth: this.currentMonth === 9 },
    { month: 'October', shortMonth: 'Oct', amount: this.getMonthAmount(10, 0), color: '#8e44ad', isCurrentMonth: this.currentMonth === 10 },
    { month: 'November', shortMonth: 'Nov', amount: this.getMonthAmount(11, 0), color: '#2980b9', isCurrentMonth: this.currentMonth === 11 },
    { month: 'December', shortMonth: 'Dec', amount: this.getMonthAmount(12, 0), color: '#27ae60', isCurrentMonth: this.currentMonth === 12 }
  ];

  get totalThisYear(): number {
    return this.monthlyData
      .filter(month => month.amount > 0)
      .reduce((sum, month) => sum + month.amount, 0);
  }

  get averageMonthly(): number {
    const completedMonths = this.monthlyData.filter((month, index) => 
      index < this.currentMonth && month.amount > 0
    );
    return completedMonths.length > 0 ? 
      completedMonths.reduce((sum, month) => sum + month.amount, 0) / completedMonths.length : 0;
  }

  get highestMonth(): { amount: number; month: string } {
    const withAmount = this.monthlyData.filter(month => month.amount > 0);
    if (withAmount.length === 0) return { amount: 0, month: 'None' };
    
    const highest = withAmount.reduce((max, month) => 
      month.amount > max.amount ? month : max
    );
    return { amount: highest.amount, month: highest.month };
  }

  get lowestMonth(): { amount: number; month: string } {
    const withAmount = this.monthlyData.filter(month => month.amount > 0);
    if (withAmount.length === 0) return { amount: 0, month: 'None' };
    
    const lowest = withAmount.reduce((min, month) => 
      month.amount < min.amount ? month : min
    );
    return { amount: lowest.amount, month: lowest.month };
  }

  get completedMonths(): number {
    return this.monthlyData.filter((month, index) => 
      index < this.currentMonth && month.amount > 0
    ).length;
  }

  get remainingMonths(): number {
    return 12 - this.currentMonth + 1;
  }

  get projectedYearlyTotal(): number {
    if (this.averageMonthly === 0) return 0;
    return this.averageMonthly * 12;
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
    if (!this.isEditMode) {
      console.log('Month summary changes saved!');
    }
  }

  formatAmount(amount: number): string {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(amount % 1000 === 0 ? 0 : 1)}k`;
    }
    return `₹${amount}`;
  }

  formatFullAmount(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  getMonthStatus(monthIndex: number): string {
    if (monthIndex < this.currentMonth - 1) return 'completed';
    if (monthIndex === this.currentMonth - 1) return 'current';
    return 'upcoming';
  }
}
