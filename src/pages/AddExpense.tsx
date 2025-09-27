import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calendar, DollarSign, Tag, FileText, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { useBudget } from '@/context/BudgetContext';

const expenseSchema = z.object({
  amount: z.number({ required_error: 'Amount is required' }).min(1, 'Amount must be greater than 0'),
  category: z.enum(['Food', 'Travel', 'Shopping', 'Bills', 'Others'], {
    required_error: 'Please select a category',
  }),
  date: z.string({ required_error: 'Date is required' }),
  notes: z.string().optional(),
});

type ExpenseFormData = z.infer<typeof expenseSchema>;

const AddExpense: React.FC = () => {
  const navigate = useNavigate();
  const { addExpense } = useBudget();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
    },
  });

  const selectedCategory = watch('category');

  const onSubmit = async (data: ExpenseFormData) => {
    setIsSubmitting(true);
    
    try {
      addExpense({
        amount: data.amount,
        category: data.category,
        date: data.date,
        notes: data.notes,
      });

      toast({
        title: 'Expense Added!',
        description: `₹${data.amount.toLocaleString()} expense recorded successfully.`,
        duration: 3000,
      });

      reset();
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add expense. Please try again.',
        variant: 'destructive',
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    { value: 'Food', label: 'Food & Dining', icon: '🍕' },
    { value: 'Travel', label: 'Travel & Transport', icon: '🚗' },
    { value: 'Shopping', label: 'Shopping', icon: '🛍️' },
    { value: 'Bills', label: 'Bills & Utilities', icon: '📄' },
    { value: 'Others', label: 'Others', icon: '📦' },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Add New Expense</h1>
        <p className="text-muted-foreground">Record your spending to track your budget</p>
      </div>

      {/* Form Card */}
      <Card className="bg-gradient-card border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary" />
            Expense Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount" className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Amount (₹)
              </Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                {...register('amount', { valueAsNumber: true })}
                className="text-lg font-semibold"
              />
              {errors.amount && (
                <p className="text-sm text-destructive">{errors.amount.message}</p>
              )}
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Category
              </Label>
              <Select onValueChange={(value) => setValue('category', value as any)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      <div className="flex items-center gap-2">
                        <span>{category.icon}</span>
                        <span>{category.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-destructive">{errors.category.message}</p>
              )}
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Date
              </Label>
              <Input
                id="date"
                type="date"
                {...register('date')}
                max={new Date().toISOString().split('T')[0]}
              />
              {errors.date && (
                <p className="text-sm text-destructive">{errors.date.message}</p>
              )}
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Notes (Optional)
              </Label>
              <Textarea
                id="notes"
                placeholder="Add any additional details..."
                {...register('notes')}
                rows={3}
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/')}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-primary hover:opacity-90"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Adding...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    Add Expense
                  </div>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Preview Card */}
      {selectedCategory && (
        <Card className="bg-gradient-card border-0 shadow-sm animate-fade-in">
          <CardHeader>
            <CardTitle className="text-lg">Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <div>
                  <p className="font-medium">{selectedCategory}</p>
                  <p className="text-sm text-muted-foreground">
                    {watch('date') ? new Date(watch('date')).toLocaleDateString() : 'Select date'}
                  </p>
                </div>
              </div>
              <div className="text-lg font-bold">
                ₹{watch('amount') ? watch('amount').toLocaleString() : '0'}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AddExpense;