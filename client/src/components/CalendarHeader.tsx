import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarHeaderProps {
  currentDate: Date;
  viewMode: 'day' | 'week' | 'month';
  onPrevious: () => void;
  onNext: () => void;
  onViewModeChange: (mode: 'day' | 'week' | 'month') => void;
}

export function CalendarHeader({
  currentDate,
  viewMode,
  onPrevious,
  onNext,
  onViewModeChange,
}: CalendarHeaderProps) {
  const monthYear = currentDate.toLocaleDateString('fr-FR', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-bold text-foreground capitalize">{monthYear}</h2>
        <div className="flex gap-2">
          <Button onClick={onPrevious} variant="outline" size="sm">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button onClick={onNext} variant="outline" size="sm">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="flex gap-2">
        {(['day', 'week', 'month'] as const).map((mode) => (
          <Button
            key={mode}
            onClick={() => onViewModeChange(mode)}
            variant={viewMode === mode ? 'default' : 'outline'}
            size="sm"
            className="capitalize"
          >
            {mode}
          </Button>
        ))}
      </div>
    </div>
  );
}
