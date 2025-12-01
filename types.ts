export enum TransactionType {
    INCOME = 'INCOME', // AR (Accounts Receivable)
    EXPENSE = 'EXPENSE', // AP (Accounts Payable), Payroll, Fixed
}

export enum ExpenseCategory {
    PAYROLL = 'PAYROLL',
    FIXED = 'FIXED', // Rent, Software, Utilities
    SUBCONTRACT = 'SUBCONTRACT', // Re-consignment/Outsourcing
}

export interface FinancialNode {
    id: string;
    description: string; // Project Name or Expense Item
    amount: number;
    dueDate: string; // YYYY-MM-DD
    type: TransactionType;
    category?: ExpenseCategory;
    status: 'PENDING' | 'PAID' | 'OVERDUE';
    relatedParty: string; // Client Name or Sub-contractor Name
    notes?: string;
}

export interface CashFlowData {
    month: string;
    income: number;
    expenses: number;
    balance: number;
}

export interface DashboardStats {
    totalReceivables: number;
    totalPayables: number;
    netCashFlow: number;
    overdueCount: number;
}
