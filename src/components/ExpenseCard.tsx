import React from 'react';
import { Calendar, Tag, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Expense } from '@/context/BudgetContext';

interface ExpenseCardProps {
  expense: Expense;
}

const categoryColors = {
  Food: 'bg-blue-500',
  Travel: 'bg-cyan-500',
  Shopping: 'bg-green-500',
  Bills: 'bg-yellow-500',
  Others: 'bg-purple-500',
};

const ExpenseCard: React.FC<ExpenseCardProps> = ({ expense }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Card className="hover:shadow-md transition-all duration-200 bg-gradient-card border-0">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${categoryColors[expense.category]}`} />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Tag className="w-4 h-4 text-muted-foreground" />
                <Badge variant="secondary" className="text-xs">
                  {expense.category}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(expense.date)}</span>
              </div>
              {expense.notes && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <FileText className="w-4 h-4" />
                  <span className="truncate">{expense.notes}</span>
                </div>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-foreground">
              ₹{expense.amount.toLocaleString()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpenseCard;