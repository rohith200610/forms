import { Component } from '@angular/core';
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
export class ProfileComponent {
  isEditMode: boolean = false;
  
  userProfile: UserProfile = {
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

  originalProfile: UserProfile = { ...this.userProfile };

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
    // Here you would typically call an API to save the profile
    console.log('Profile saved:', this.userProfile);
    // You could add a success message here
  }

  onImageChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.userProfile.profilePicture = e.target.result;
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
