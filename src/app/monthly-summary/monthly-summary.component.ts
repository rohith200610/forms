import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-monthly-summary',
  imports: [CommonModule, FormsModule],
  templateUrl: './monthly-summary.component.html',
  styleUrl: './monthly-summary.component.css'
})
export class MonthlySummaryComponent implements OnInit {
  private readonly STORAGE_KEY = 'monthlySummary';
  
  isEditMode: boolean = false;
  isDetailEditMode: boolean = false;

  // Default data
  private defaultData = {
    totalIncome: 20000,
    totalExpenses: 12500,
    salaryAmount: 18000,
    freelanceAmount: 2000,
    rentAmount: 8000,
    foodAmount: 3000,
    transportAmount: 1500
  };

  // Main totals
  totalIncome: number = this.defaultData.totalIncome;
  totalExpenses: number = this.defaultData.totalExpenses;

  // Income breakdown
  salaryAmount: number = this.defaultData.salaryAmount;
  freelanceAmount: number = this.defaultData.freelanceAmount;

  // Expense breakdown
  rentAmount: number = this.defaultData.rentAmount;
  foodAmount: number = this.defaultData.foodAmount;
  transportAmount: number = this.defaultData.transportAmount;

  ngOnInit() {
    this.loadData();
  }

  // Load data from localStorage
  loadData() {
    try {
      const savedData = localStorage.getItem(this.STORAGE_KEY);
      if (savedData) {
        const data = JSON.parse(savedData);
        this.totalIncome = data.totalIncome || this.defaultData.totalIncome;
        this.totalExpenses = data.totalExpenses || this.defaultData.totalExpenses;
        this.salaryAmount = data.salaryAmount || this.defaultData.salaryAmount;
        this.freelanceAmount = data.freelanceAmount || this.defaultData.freelanceAmount;
        this.rentAmount = data.rentAmount || this.defaultData.rentAmount;
        this.foodAmount = data.foodAmount || this.defaultData.foodAmount;
        this.transportAmount = data.transportAmount || this.defaultData.transportAmount;
        console.log('Monthly summary data loaded from localStorage');
      }
    } catch (error) {
      console.error('Error loading monthly summary from localStorage:', error);
      this.resetToDefaults();
    }
  }

  // Save data to localStorage
  saveToStorage() {
    try {
      const dataToSave = {
        totalIncome: this.totalIncome,
        totalExpenses: this.totalExpenses,
        salaryAmount: this.salaryAmount,
        freelanceAmount: this.freelanceAmount,
        rentAmount: this.rentAmount,
        foodAmount: this.foodAmount,
        transportAmount: this.transportAmount
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(dataToSave));
      console.log('Monthly summary data saved to localStorage successfully');
      return true;
    } catch (error) {
      console.error('Error saving monthly summary to localStorage:', error);
      return false;
    }
  }

  // Reset to default values
  resetToDefaults() {
    this.totalIncome = this.defaultData.totalIncome;
    this.totalExpenses = this.defaultData.totalExpenses;
    this.salaryAmount = this.defaultData.salaryAmount;
    this.freelanceAmount = this.defaultData.freelanceAmount;
    this.rentAmount = this.defaultData.rentAmount;
    this.foodAmount = this.defaultData.foodAmount;
    this.transportAmount = this.defaultData.transportAmount;
  }

  get remaining(): number {
    return this.totalIncome - this.totalExpenses;
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
    if (!this.isEditMode) {
      this.saveToStorage(); // Save changes
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
      this.saveToStorage(); // Save changes
      console.log('Detail breakdown saved!');
    }
  }
}
