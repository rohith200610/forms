import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

interface Expense {
  title: string;
  amount: number;
  date: string;
  category: string;
  type: string;
}

@Component({
  selector: 'app-expense-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './expense-list.component.html',
  styleUrl: './expense-list.component.css'
})
export class ExpenseListComponent implements OnInit {
  private readonly STORAGE_KEY = 'expensesList';
  
  searchTerm: string = '';
  showAddForm: boolean = false;
  isEditMode: boolean = false;
  
  // Default expenses
  private defaultExpenses: Expense[] = [
    { title: 'Coffee', amount: 150, date: '2025-06-26', category: 'Food', type: 'Expense' },
    { title: 'Salary', amount: 20000, date: '2025-06-25', category: 'Income', type: 'Income' },
    { title: 'Electricity', amount: 1200, date: '2025-06-24', category: 'Bills', type: 'Expense' }
  ];

  expenses: Expense[] = [...this.defaultExpenses];
  filteredExpenses: Expense[] = [...this.expenses];

  newExpense: Expense = {
    title: '',
    amount: 0,
    date: '',
    category: '',
    type: ''
  };

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.loadExpenses();
    
    // Check if we should show the add form based on query parameter
    this.route.queryParams.subscribe(params => {
      if (params['showAddForm'] === 'true') {
        this.showAddForm = true;
      }
    });
  }

  // Load expenses from localStorage
  loadExpenses() {
    try {
      const savedExpenses = localStorage.getItem(this.STORAGE_KEY);
      if (savedExpenses) {
        this.expenses = JSON.parse(savedExpenses);
        this.filteredExpenses = [...this.expenses];
        console.log('Expenses loaded from localStorage');
      }
    } catch (error) {
      console.error('Error loading expenses from localStorage:', error);
      this.expenses = [...this.defaultExpenses];
      this.filteredExpenses = [...this.expenses];
    }
  }

  // Save expenses to localStorage
  saveToStorage() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.expenses));
      console.log('Expenses saved to localStorage successfully');
      return true;
    } catch (error) {
      console.error('Error saving expenses to localStorage:', error);
      return false;
    }
  }

  get totalIncome(): number {
    return this.expenses
      .filter(expense => expense.type === 'Income')
      .reduce((sum, expense) => sum + expense.amount, 0);
  }

  get totalExpenses(): number {
    return this.expenses
      .filter(expense => expense.type === 'Expense')
      .reduce((sum, expense) => sum + expense.amount, 0);
  }

  get netBalance(): number {
    return this.totalIncome - this.totalExpenses;
  }

  onSearch() {
    if (!this.searchTerm.trim()) {
      this.filteredExpenses = [...this.expenses];
    } else {
      this.filteredExpenses = this.expenses.filter(expense =>
        expense.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        expense.category.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        expense.type.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  toggleAddExpenseForm() {
    this.showAddForm = !this.showAddForm;
    if (this.showAddForm) {
      this.resetNewExpense();
    }
  }

  addExpense() {
    if (this.isFormValid()) {
      this.expenses.push({ ...this.newExpense });
      this.filteredExpenses = [...this.expenses];
      this.saveToStorage(); // Save to localStorage
      this.resetNewExpense();
      this.showAddForm = false;
      console.log('Expense added successfully!');
    }
  }

  cancelAddExpense() {
    this.showAddForm = false;
    this.resetNewExpense();
  }

  resetNewExpense() {
    this.newExpense = {
      title: '',
      amount: 0,
      date: '',
      category: '',
      type: ''
    };
  }

  isFormValid(): boolean {
    return this.newExpense.title !== '' &&
           this.newExpense.amount > 0 &&
           this.newExpense.date !== '' &&
           this.newExpense.category !== '' &&
           this.newExpense.type !== '';
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
    if (!this.isEditMode) {
      // Save changes when exiting edit mode
      this.saveToStorage();
      console.log('Changes saved!');
    }
  }

  deleteExpense(index: number) {
    if (confirm('Are you sure you want to delete this expense?')) {
      this.expenses.splice(index, 1);
      this.filteredExpenses = [...this.expenses];
      this.saveToStorage(); // Save to localStorage
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }
}
