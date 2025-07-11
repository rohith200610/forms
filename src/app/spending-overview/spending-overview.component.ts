import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface SpendingCategory {
  category: string;
  percentage: number;
  amount: number;
}

@Component({
  selector: 'app-spending-overview',
  imports: [CommonModule, FormsModule],
  templateUrl: './spending-overview.component.html',
  styleUrl: './spending-overview.component.css'
})
export class SpendingOverviewComponent {
  isEditMode: boolean = false;
  
  spendingCategories: SpendingCategory[] = [
    { category: 'Food', percentage: 30, amount: 735 },
    { category: 'Travel', percentage: 25, amount: 612.5 },
    { category: 'Bills', percentage: 20, amount: 490 },
    { category: 'Others', percentage: 25, amount: 612.5 }
  ];

  totalSpending: number = 2450;
  budgetTotal: number = 3000;

  get budgetRemaining(): number {
    return this.budgetTotal - this.totalSpending;
  }

  toggleEditMode() {
    if (this.isEditMode) {
      this.calculateAmounts();
    }
    this.isEditMode = !this.isEditMode;
  }

  calculateAmounts() {
    // Recalculate amounts based on percentages
    this.spendingCategories.forEach(category => {
      category.amount = (category.percentage / 100) * this.totalSpending;
    });
  }

  updatePercentage(index: number, newPercentage: number) {
    this.spendingCategories[index].percentage = newPercentage;
    this.calculateAmounts();
  }

  onTotalSpendingChange() {
    this.calculateAmounts();
  }
}
