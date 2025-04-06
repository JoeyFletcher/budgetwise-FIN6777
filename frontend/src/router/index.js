import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../pages/HomePage.vue';
import LoginPage from '../pages/LoginPage.vue';
import SignupPage from '../pages/SignupPage.vue';
import DashboardPage from '../pages/DashboardPage.vue';
import ForgotPassword from '../pages/ForgotPassword.vue';
import TwoFactorPage from "pages/TwoFactorPage.vue";

// Import dashboard sections using relative paths
import TransactionsSection from '../components/dashboard/sections/TransactionsSection.vue';
import BudgetingSection from '../components/dashboard/sections/BudgetingSection.vue';
import LinkBankSection from '../components/dashboard/sections/LinkBankSection.vue';
import InvestmentsSection from '../components/dashboard/sections/InvestmentsSection.vue';
import AccountSettingsSection from '../components/dashboard/sections/AccountSettingsSection.vue';
import AccountSummary from '../components/dashboard/sections/AccountSummary.vue';

const routes = [
  {
    path: '/',
    name: 'HomePage',
    component: HomePage,
  },
  {
    path: '/login',
    name: 'LoginPage',
    component: LoginPage,
  },
  {
    path: '/twofactorlock',
    name: 'TwoFactorPage',
    component: TwoFactorPage,
  },
  {
    path: '/signup',
    name: 'SignupPage',
    component: SignupPage,
  },
  {
    path: '/dashboard',
    name: 'DashboardPage',
    component: DashboardPage,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'AccountSummary',
        component: AccountSummary, // Default when visiting /dashboard
      },
      {
        path: 'transactions',
        name: 'Transactions',
        component: TransactionsSection,
      },
      {
        path: 'budgeting',
        name: 'Budgeting',
        component: BudgetingSection,
      },
      {
        path: 'linked-accounts',
        name: 'LinkedAccounts',
        component: LinkBankSection,
      },
      {
        path: 'investments',
        name: 'Investments',
        component: InvestmentsSection,
      },
      {
        path: 'account-settings',
        name: 'AccountSettings',
        component: AccountSettingsSection,
      },
    ],
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPassword,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
