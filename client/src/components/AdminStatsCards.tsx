import { Card } from '@/components/ui/card';
import { Users, Calendar, Star, MessageCircle } from 'lucide-react';

interface AdminStatsCardsProps {
  totalClients: number;
  totalConsultations: number;
  totalTestimonials: number;
  averageRating: string | number;
}

export function AdminStatsCards({
  totalClients,
  totalConsultations,
  totalTestimonials,
  averageRating,
}: AdminStatsCardsProps) {
  const stats = [
    {
      label: 'Clients',
      value: totalClients,
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: 'Consultations',
      value: totalConsultations,
      icon: Calendar,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      label: 'Avis Publiés',
      value: totalTestimonials,
      icon: MessageCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      label: 'Note Moyenne',
      value: `${averageRating}/5`,
      icon: Star,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label} className="p-6 bg-card border-accent/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              </div>
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
