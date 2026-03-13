import { Card } from '@/components/ui/card';
import { Eye, TrendingUp } from 'lucide-react';

interface VisitStatsProps {
  totalVisits: number;
  averageVisitsPerDay: number;
  dailyVisitors: Array<{ date: string; visitors: number }>;
}

export function VisitStats({ totalVisits, averageVisitsPerDay, dailyVisitors }: VisitStatsProps) {
  const maxVisits = Math.max(...dailyVisitors.map((v) => v.visitors), 1);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6 bg-card border-accent/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Visites Totales</p>
              <p className="text-3xl font-bold text-foreground">{totalVisits}</p>
            </div>
            <div className="bg-blue-500/10 p-3 rounded-lg">
              <Eye className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card border-accent/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Moyenne par Jour</p>
              <p className="text-3xl font-bold text-foreground">{averageVisitsPerDay.toFixed(1)}</p>
            </div>
            <div className="bg-green-500/10 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6 bg-card border-accent/20">
        <h3 className="text-lg font-semibold text-foreground mb-4">Visites par Jour</h3>
        <div className="space-y-2">
          {dailyVisitors.map((day) => (
            <div key={day.date} className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground w-16">{day.date}</span>
              <div className="flex-1 bg-accent/20 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-accent h-full rounded-full transition-all duration-300"
                  style={{ width: `${(day.visitors / maxVisits) * 100}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-foreground w-8 text-right">{day.visitors}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
