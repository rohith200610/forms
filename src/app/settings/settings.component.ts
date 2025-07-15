import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface AppSettings {
  theme: string;
  currency: string;
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    expenseReminders: boolean;
    monthlyReports: boolean;
  };
  privacy: {
    profileVisibility: string;
    dataSharing: boolean;
    analytics: boolean;
  };
  preferences: {
    defaultExpenseCategory: string;
    autoBackup: boolean;
    dataRetention: string;
    budgetWarnings: boolean;
  };
}

@Component({
  selector: 'app-settings',
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  settings: AppSettings = {
    theme: 'auto',
    currency: 'INR',
    language: 'en',
    notifications: {
      email: true,
      push: true,
      expenseReminders: true,
      monthlyReports: true
    },
    privacy: {
      profileVisibility: 'private',
      dataSharing: false,
      analytics: true
    },
    preferences: {
      defaultExpenseCategory: 'Food',
      autoBackup: true,
      dataRetention: '2years',
      budgetWarnings: true
    }
  };

  themes = [
    { value: 'light', label: 'Light Theme', icon: 'fas fa-sun' },
    { value: 'dark', label: 'Dark Theme', icon: 'fas fa-moon' },
    { value: 'auto', label: 'Auto (System)', icon: 'fas fa-adjust' }
  ];

  currencies = [
    { value: 'INR', label: 'Indian Rupee (₹)', symbol: '₹' },
    { value: 'USD', label: 'US Dollar ($)', symbol: '$' },
    { value: 'EUR', label: 'Euro (€)', symbol: '€' },
    { value: 'GBP', label: 'British Pound (£)', symbol: '£' },
    { value: 'JPY', label: 'Japanese Yen (¥)', symbol: '¥' }
  ];

  languages = [
    { value: 'en', label: 'English' },
    { value: 'hi', label: 'हिंदी (Hindi)' },
    { value: 'es', label: 'Español (Spanish)' },
    { value: 'fr', label: 'Français (French)' },
    { value: 'de', label: 'Deutsch (German)' }
  ];

  expenseCategories = [
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Entertainment',
    'Bills & Utilities',
    'Healthcare',
    'Education',
    'Travel',
    'Other'
  ];

  dataRetentionOptions = [
    { value: '1year', label: '1 Year' },
    { value: '2years', label: '2 Years' },
    { value: '5years', label: '5 Years' },
    { value: 'forever', label: 'Forever' }
  ];

  saveSettings() {
    // Here you would typically call an API to save settings
    console.log('Settings saved:', this.settings);
    
    // Show success message (you could use a toast notification)
    alert('Settings saved successfully!');
    
    // Apply theme change if needed
    this.applyTheme();
  }

  resetSettings() {
    if (confirm('Are you sure you want to reset all settings to default? This action cannot be undone.')) {
      // Reset to default values
      this.settings = {
        theme: 'auto',
        currency: 'INR',
        language: 'en',
        notifications: {
          email: true,
          push: true,
          expenseReminders: true,
          monthlyReports: true
        },
        privacy: {
          profileVisibility: 'private',
          dataSharing: false,
          analytics: true
        },
        preferences: {
          defaultExpenseCategory: 'Food & Dining',
          autoBackup: true,
          dataRetention: '2years',
          budgetWarnings: true
        }
      };
      
      this.saveSettings();
    }
  }

  exportData() {
    // This would typically export user data
    console.log('Exporting data...');
    alert('Data export feature will be available soon!');
  }

  deleteAccount() {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently lost.')) {
      if (confirm('This is your final warning. Are you absolutely sure you want to delete your account?')) {
        console.log('Account deletion requested...');
        alert('Account deletion feature will be available soon. Please contact support for now.');
      }
    }
  }

  private applyTheme() {
    // This would apply the theme to the application
    document.body.setAttribute('data-theme', this.settings.theme);
  }

  onThemeChange() {
    this.applyTheme();
  }
}
