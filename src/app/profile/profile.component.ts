import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  profession: string;
  monthlyIncome: number;
  currency: string;
  profilePicture: string;
  joinDate: Date;
  totalExpenses: number;
  totalSavings: number;
}

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  isEditMode: boolean = false;
  private readonly STORAGE_KEY = 'userProfile';
  
  // Default profile data
  private defaultProfile: UserProfile = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+91 9876543210',
    profession: 'Software Engineer',
    monthlyIncome: 50000,
    currency: 'INR',
    profilePicture: 'https://via.placeholder.com/150/667eea/ffffff?text=JD',
    joinDate: new Date('2024-01-15'),
    totalExpenses: 125000,
    totalSavings: 75000
  };

  userProfile: UserProfile = { ...this.defaultProfile };
  originalProfile: UserProfile = { ...this.userProfile };

  ngOnInit() {
    this.loadProfile();
  }

  // Load profile data from localStorage
  loadProfile() {
    try {
      const savedProfile = localStorage.getItem(this.STORAGE_KEY);
      if (savedProfile) {
        const parsedProfile = JSON.parse(savedProfile);
        // Convert joinDate string back to Date object
        parsedProfile.joinDate = new Date(parsedProfile.joinDate);
        this.userProfile = parsedProfile;
        this.originalProfile = { ...this.userProfile };
        console.log('Profile loaded from localStorage:', this.userProfile);
      } else {
        // No saved profile, use default
        this.userProfile = { ...this.defaultProfile };
        this.originalProfile = { ...this.userProfile };
        console.log('Using default profile');
      }
    } catch (error) {
      console.error('Error loading profile from localStorage:', error);
      // Fall back to default profile
      this.userProfile = { ...this.defaultProfile };
      this.originalProfile = { ...this.userProfile };
    }
  }

  // Save profile data to localStorage
  saveToStorage() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.userProfile));
      console.log('Profile saved to localStorage successfully');
      return true;
    } catch (error) {
      console.error('Error saving profile to localStorage:', error);
      return false;
    }
  }

  toggleEditMode() {
    if (this.isEditMode) {
      // Save changes
      this.saveProfile();
    } else {
      // Enter edit mode
      this.originalProfile = { ...this.userProfile };
    }
    this.isEditMode = !this.isEditMode;
  }

  cancelEdit() {
    this.userProfile = { ...this.originalProfile };
    this.isEditMode = false;
  }

  saveProfile() {
    // Save to localStorage
    const saved = this.saveToStorage();
    if (saved) {
      console.log('Profile saved successfully:', this.userProfile);
      // Show success message (you could use a toast notification service here)
      this.showSuccessMessage('Profile saved successfully!');
    } else {
      console.error('Failed to save profile');
      this.showErrorMessage('Failed to save profile. Please try again.');
    }
  }

  // Simple success message (you could replace this with a proper toast service)
  showSuccessMessage(message: string) {
    // For now, just log. In a real app, you'd use a toast notification
    console.log('SUCCESS:', message);
    // You could also temporarily show a message in the UI
  }

  showErrorMessage(message: string) {
    // For now, just log. In a real app, you'd use a toast notification
    console.error('ERROR:', message);
    // You could also temporarily show a message in the UI
  }

  onImageChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.userProfile.profilePicture = e.target.result;
        // Auto-save the profile picture change
        this.saveToStorage();
      };
      reader.readAsDataURL(file);
    }
  }

  get membershipDuration(): string {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - this.userProfile.joinDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const months = Math.floor(diffDays / 30);
    const days = diffDays % 30;
    
    if (months > 0) {
      return `${months} month${months > 1 ? 's' : ''} ${days > 0 ? `and ${days} day${days > 1 ? 's' : ''}` : ''}`;
    }
    return `${days} day${days > 1 ? 's' : ''}`;
  }

  get savingsRate(): number {
    return this.userProfile.totalSavings / (this.userProfile.totalSavings + this.userProfile.totalExpenses) * 100;
  }
}
