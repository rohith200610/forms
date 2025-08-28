import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-user-management',
  imports: [CommonModule, FormsModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  searchTerm: string = '';
  selectedUser: User | null = null;
  isEditMode: boolean = false;
  
  // Available roles and permissions
  availableRoles = ['admin', 'user'];
  availablePermissions = ['read', 'write', 'delete', 'manage_users', 'view_all_data'];

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    // Get all users from the auth service
    this.users = this.authService.getAllUsers();
    this.filteredUsers = [...this.users];
  }

  searchUsers() {
    if (!this.searchTerm.trim()) {
      this.filteredUsers = [...this.users];
    } else {
      this.filteredUsers = this.users.filter(user =>
        user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  selectUser(user: User) {
    this.selectedUser = { ...user };
    this.isEditMode = false;
  }

  editUser() {
    this.isEditMode = true;
  }

  saveUser() {
    if (this.selectedUser) {
      const success = this.authService.updateUser(this.selectedUser);
      if (success) {
        this.isEditMode = false;
        this.loadUsers();
        alert('User updated successfully! Changes are saved permanently.');
      } else {
        alert('Failed to update user. You may not have permission.');
      }
    }
  }

  cancelEdit() {
    if (this.selectedUser) {
      // Reload the original user data
      const originalUser = this.users.find(u => u.id === this.selectedUser!.id);
      if (originalUser) {
        this.selectedUser = { ...originalUser };
      }
    }
    this.isEditMode = false;
  }

  deleteUser(user: User) {
    if (confirm(`Are you sure you want to delete user "${user.name}"? This action cannot be undone.`)) {
      const success = this.authService.deleteUser(user.id);
      if (success) {
        this.loadUsers();
        if (this.selectedUser?.id === user.id) {
          this.selectedUser = null;
        }
        alert('User deleted successfully! Changes are saved permanently.');
      } else {
        alert('Failed to delete user. You cannot delete yourself or you may not have permission.');
      }
    }
  }

  togglePermission(permission: string) {
    if (this.selectedUser) {
      const index = this.selectedUser.permissions.indexOf(permission);
      if (index > -1) {
        this.selectedUser.permissions.splice(index, 1);
      } else {
        this.selectedUser.permissions.push(permission);
      }
    }
  }

  hasPermission(permission: string): boolean {
    return this.selectedUser?.permissions.includes(permission) || false;
  }

  onRoleChange() {
    if (this.selectedUser) {
      // Update permissions based on role
      if (this.selectedUser.role === 'admin') {
        this.selectedUser.permissions = [...this.availablePermissions];
      } else {
        this.selectedUser.permissions = ['read', 'write'];
      }
    }
  }

  getUserStatusClass(user: User): string {
    return user.role === 'admin' ? 'badge bg-warning text-dark' : 'badge bg-primary';
  }

  getPermissionBadgeClass(permission: string): string {
    const badgeClasses: { [key: string]: string } = {
      'read': 'bg-success',
      'write': 'bg-info',
      'delete': 'bg-danger',
      'manage_users': 'bg-warning text-dark',
      'view_all_data': 'bg-secondary'
    };
    return `badge ${badgeClasses[permission] || 'bg-light text-dark'}`;
  }

  getTotalUsers(): number {
    return this.users.length;
  }

  getAdminCount(): number {
    return this.users.filter(u => u.role === 'admin').length;
  }

  getUserCount(): number {
    return this.users.filter(u => u.role === 'user').length;
  }

  resetDatabase() {
    if (confirm('Are you sure you want to reset the users database to defaults? All custom users will be lost!')) {
      if (confirm('This is your final warning. This action cannot be undone. Continue?')) {
        const success = this.authService.resetUsersDatabase();
        if (success) {
          this.loadUsers();
          this.selectedUser = null;
          alert('Users database has been reset to defaults.');
        } else {
          alert('Failed to reset database. You may not have permission.');
        }
      }
    }
  }
}
