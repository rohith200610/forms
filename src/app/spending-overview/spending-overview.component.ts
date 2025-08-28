import { Component, OnInit } from '@angular/core';
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
export class SpendingOverviewComponent implements OnInit {
  private readonly STORAGE_KEY = 'spendingOverview';
  
  isEditMode: boolean = false;
  
  // Default data
  private defaultData = {
    spendingCategories: [
      { category: 'Food', percentage: 30, amount: 735 },
      { category: 'Travel', percentage: 25, amount: 612.5 },
      { category: 'Bills', percentage: 20, amount: 490 },
      { category: 'Others', percentage: 25, amount: 612.5 }
    ],
    totalSpending: 2450,
    budgetTotal: 3000
  };

  spendingCategories: SpendingCategory[] = [...this.defaultData.spendingCategories];
  totalSpending: number = this.defaultData.totalSpending;
  budgetTotal: number = this.defaultData.budgetTotal;

  ngOnInit() {
    this.loadData();
  }

  // Load data from localStorage
  loadData() {
    try {
      const savedData = localStorage.getItem(this.STORAGE_KEY);
      if (savedData) {
        const data = JSON.parse(savedData);
        this.spendingCategories = data.spendingCategories || [...this.defaultData.spendingCategories];
        this.totalSpending = data.totalSpending || this.defaultData.totalSpending;
        this.budgetTotal = data.budgetTotal || this.defaultData.budgetTotal;
        console.log('Spending overview data loaded from localStorage');
      }
    } catch (error) {
      console.error('Error loading spending overview from localStorage:', error);
      this.spendingCategories = [...this.defaultData.spendingCategories];
      this.totalSpending = this.defaultData.totalSpending;
      this.budgetTotal = this.defaultData.budgetTotal;
    }
  }

  // Save data to localStorage
  saveToStorage() {
    try {
      const dataToSave = {
        spendingCategories: this.spendingCategories,
        totalSpending: this.totalSpending,
        budgetTotal: this.budgetTotal
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(dataToSave));
      console.log('Spending overview data saved to localStorage successfully');
      return true;
    } catch (error) {
      console.error('Error saving spending overview to localStorage:', error);
      return false;
    }
  }

  get budgetRemaining(): number {
    return this.budgetTotal - this.totalSpending;
  }

  toggleEditMode() {
    if (this.isEditMode) {
      this.calculateAmounts();
      this.saveToStorage(); // Save changes
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
    this.saveToStorage(); // Auto-save when total spending changes
  }
}
