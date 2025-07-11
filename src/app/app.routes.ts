import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MonthlySummaryComponent } from './monthly-summary/monthly-summary.component';
import { SpendingOverviewComponent } from './spending-overview/spending-overview.component';
import { MonthSummaryComponent } from './month-summary/month-summary.component';
import { ExpenseListComponent } from './expense-list/expense-list.component';
import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { 
    path: '', 
    component: LayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'monthly-summary', component: MonthlySummaryComponent },
      { path: 'spending-overview', component: SpendingOverviewComponent },
      { path: 'month-summary', component: MonthSummaryComponent },
      { path: 'expense-list', component: ExpenseListComponent }
    ]
  },
  { path: '**', redirectTo: '/login' }
];
