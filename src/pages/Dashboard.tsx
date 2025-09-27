import React from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useBudget } from '@/context/BudgetContext';
import ExpenseCard from '@/components/ExpenseCard';

const Dashboard: React.FC = () => {
  const { state, getTotalSpent, getRemainingBudget, getPrediction } = useBudget();
  
  const totalSpent = getTotalSpent();
  const remainingBudget = getRemainingBudget();
  const spentPercentage = (totalSpent / state.monthlyBudget) * 100;
  const prediction = getPrediction();
  
  // Get recent expenses (last 5)
  const recentExpenses = [...state.expenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const isPredictionNegative = prediction.includes('overspend');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Financial Dashboard</h1>
        <p className="text-muted-foreground">Track your spending and stay on budget</p>
      </div>

      {/* Budget Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Monthly Budget */}
        <Card className="bg-gradient-card border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Monthly Budget
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              ₹{state.monthlyBudget.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Your total budget for this month
            </p>
          </CardContent>
        </Card>

        {/* Total Spent */}
        <Card className="bg-gradient-card border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Spent
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              ₹{totalSpent.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {spentPercentage.toFixed(1)}% of your budget
            </p>
          </CardContent>
        </Card>

        {/* Remaining Budget */}
        <Card className="bg-gradient-card border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Remaining Budget
            </CardTitle>
            {remainingBudget >= 0 ? (
              <CheckCircle className="h-4 w-4 text-success" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-destructive" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${remainingBudget >= 0 ? 'text-success' : 'text-destructive'}`}>
              ₹{Math.abs(remainingBudget).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {remainingBudget >= 0 ? 'Available to spend' : 'Over budget'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Budget Progress */}
      <Card className="bg-gradient-card border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Budget Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Spent this month</span>
              <span className="font-medium">
                ₹{totalSpent.toLocaleString()} / ₹{state.monthlyBudget.toLocaleString()}
              </span>
            </div>
            <Progress 
              value={Math.min(spentPercentage, 100)} 
              className="h-3"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span>{spentPercentage.toFixed(1)}%</span>
              <span>100%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Prediction Alert */}
      <Alert className={`border-0 ${isPredictionNegative ? 'bg-destructive/10' : 'bg-success/10'}`}>
        <AlertTriangle className={`h-4 w-4 ${isPredictionNegative ? 'text-destructive' : 'text-success'}`} />
        <AlertDescription className={isPredictionNegative ? 'text-destructive' : 'text-success'}>
          <strong>Spending Prediction:</strong> {prediction}
        </AlertDescription>
      </Alert>

      {/* Recent Expenses */}
      <Card className="bg-gradient-card border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-primary" />
            Recent Expenses
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentExpenses.length > 0 ? (
            <div className="space-y-3">
              {recentExpenses.map((expense) => (
                <ExpenseCard key={expense.id} expense={expense} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <TrendingDown className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No expenses recorded yet</p>
              <p className="text-sm">Start tracking your spending!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;