import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface MonthData {
  month: string;
  shortMonth: string;
  amount: number;
}

@Component({
  selector: 'app-month-summary',
  imports: [CommonModule, FormsModule],
  templateUrl: './month-summary.component.html',
  styleUrl: './month-summary.component.css'
})
export class MonthSummaryComponent {
  isEditMode: boolean = false;
  
  monthlyData: MonthData[] = [
    { month: 'January', shortMonth: 'Jan', amount: 2000 },
    { month: 'February', shortMonth: 'Feb', amount: 3000 },
    { month: 'March', shortMonth: 'Mar', amount: 1000 },
    { month: 'April', shortMonth: 'Apr', amount: 5000 },
    { month: 'May', shortMonth: 'May', amount: 1500 },
    { month: 'Others', shortMonth: '...', amount: 0 }
  ];

  get totalThisYear(): number {
    return this.monthlyData.reduce((sum, month) => sum + month.amount, 0);
  }

  get averageMonthly(): number {
    const activeMonths = this.monthlyData.filter(month => month.amount > 0);
    return activeMonths.length > 0 ? this.totalThisYear / activeMonths.length : 0;
  }

  get highestMonth(): { amount: number; month: string } {
    const highest = this.monthlyData.reduce((max, month) => 
      month.amount > max.amount ? month : max
    );
    return { amount: highest.amount, month: highest.shortMonth };
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
    if (!this.isEditMode) {
      console.log('Month summary changes saved!');
    }
  }

  formatAmount(amount: number): string {
    if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(amount % 1000 === 0 ? 0 : 1)}k`;
    }
    return `₹${amount}`;
  }
}
