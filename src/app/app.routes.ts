import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MonthlySummaryComponent } from './monthly-summary/monthly-summary.component';
import { SpendingOverviewComponent } from './spending-overview/spending-overview.component';
import { MonthSummaryComponent } from './month-summary/month-summary.component';
import { ExpenseListComponent } from './expense-list/expense-list.component';
import { ProfileComponent } from './profile/profile.component';
import { SettingsComponent } from './settings/settings.component';
import { HelpComponent } from './help/help.component';
import { LayoutComponent } from './layout/layout.component';
import { UserManagementComponent } from './admin/user-management/user-management.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { LoginGuard } from './guards/login.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { 
    path: 'login', 
    component: LoginComponent,
    canActivate: [LoginGuard] // Prevent access if already logged in
  },
  { 
    path: '', 
    component: LayoutComponent,
    canActivate: [AuthGuard], // Require authentication for all child routes
    children: [
      { 
        path: 'dashboard', 
        component: DashboardComponent 
      },
      { 
        path: 'monthly-summary', 
        component: MonthlySummaryComponent,
        canActivate: [RoleGuard],
        data: { permission: 'read' } // Require read permission
      },
      { 
        path: 'spending-overview', 
        component: SpendingOverviewComponent,
        canActivate: [RoleGuard],
        data: { permission: 'read' }
      },
      { 
        path: 'month-summary', 
        component: MonthSummaryComponent,
        canActivate: [RoleGuard],
        data: { permission: 'read' }
      },
      { 
        path: 'expense-list', 
        component: ExpenseListComponent,
        canActivate: [RoleGuard],
        data: { permission: 'write' } // Require write permission for expenses
      },
      { 
        path: 'profile', 
        component: ProfileComponent 
      },
      { 
        path: 'settings', 
        component: SettingsComponent,
        canActivate: [RoleGuard],
        data: { permission: 'write' } // Require write permission for settings
      },
      { 
        path: 'help', 
        component: HelpComponent 
      },
      {
        path: 'admin/users',
        component: UserManagementComponent,
        canActivate: [RoleGuard],
        data: { role: 'admin' } // Only admins can access
      }
    ]
  },
  { path: '**', redirectTo: '/login' }
];
