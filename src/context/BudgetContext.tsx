import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface Expense {
  id: string;
  amount: number;
  category: 'Food' | 'Travel' | 'Shopping' | 'Bills' | 'Others';
  date: string;
  notes?: string;
}

interface BudgetState {
  monthlyBudget: number;
  expenses: Expense[];
}

interface BudgetContextType {
  state: BudgetState;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  setMonthlyBudget: (budget: number) => void;
  getTotalSpent: () => number;
  getRemainingBudget: () => number;
  getPrediction: () => string;
  getExpensesByCategory: () => Array<{ category: string; amount: number; color: string }>;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

type BudgetAction =
  | { type: 'ADD_EXPENSE'; payload: Expense }
  | { type: 'SET_BUDGET'; payload: number };

const budgetReducer = (state: BudgetState, action: BudgetAction): BudgetState => {
  switch (action.type) {
    case 'ADD_EXPENSE':
      return {
        ...state,
        expenses: [...state.expenses, action.payload],
      };
    case 'SET_BUDGET':
      return {
        ...state,
        monthlyBudget: action.payload,
      };
    default:
      return state;
  }
};

const initialState: BudgetState = {
  monthlyBudget: 50000, // Default budget of ₹50,000
  expenses: [
    {
      id: '1',
      amount: 2500,
      category: 'Food',
      date: '2025-01-15',
      notes: 'Groceries and dining',
    },
    {
      id: '2',
      amount: 1800,
      category: 'Travel',
      date: '2025-01-14',
      notes: 'Cab fare',
    },
    {
      id: '3',
      amount: 3200,
      category: 'Shopping',
      date: '2025-01-13',
      notes: 'Clothing',
    },
    {
      id: '4',
      amount: 4500,
      category: 'Bills',
      date: '2025-01-12',
      notes: 'Electricity and water',
    },
  ],
};

export const BudgetProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(budgetReducer, initialState);

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
    };
    dispatch({ type: 'ADD_EXPENSE', payload: newExpense });
  };

  const setMonthlyBudget = (budget: number) => {
    dispatch({ type: 'SET_BUDGET', payload: budget });
  };

  const getTotalSpent = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return state.expenses
      .filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
      })
      .reduce((total, expense) => total + expense.amount, 0);
  };

  const getRemainingBudget = () => {
    return state.monthlyBudget - getTotalSpent();
  };

  const getPrediction = () => {
    const currentDate = new Date();
    const dayOfMonth = currentDate.getDate();
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const totalSpent = getTotalSpent();
    
    if (totalSpent === 0) {
      return "No expenses recorded yet this month.";
    }
    
    const dailyAverage = totalSpent / dayOfMonth;
    const projectedTotal = dailyAverage * daysInMonth;
    const difference = projectedTotal - state.monthlyBudget;
    
    if (difference > 0) {
      const overspendDate = Math.ceil(state.monthlyBudget / dailyAverage);
      return `At this rate, you'll overspend by the ${overspendDate}th of the month`;
    } else {
      const savings = Math.abs(difference);
      return `You are on track to save ₹${savings.toLocaleString()} this month`;
    }
  };

  const getExpensesByCategory = () => {
    const categories = ['Food', 'Travel', 'Shopping', 'Bills', 'Others'];
    const colors = ['#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#8b5cf6'];
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const currentMonthExpenses = state.expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
    });
    
    return categories.map((category, index) => ({
      category,
      amount: currentMonthExpenses
        .filter(expense => expense.category === category)
        .reduce((total, expense) => total + expense.amount, 0),
      color: colors[index],
    })).filter(item => item.amount > 0);
  };

  return (
    <BudgetContext.Provider
      value={{
        state,
        addExpense,
        setMonthlyBudget,
        getTotalSpent,
        getRemainingBudget,
        getPrediction,
        getExpensesByCategory,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (context === undefined) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
};