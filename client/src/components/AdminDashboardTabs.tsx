import { Button } from '@/components/ui/button';

interface AdminDashboardTabsProps {
  activeTab: 'stats' | 'testimonials' | 'agenda' | 'visits';
  onTabChange: (tab: 'stats' | 'testimonials' | 'agenda' | 'visits') => void;
}

export function AdminDashboardTabs({ activeTab, onTabChange }: AdminDashboardTabsProps) {
  const tabs = [
    { id: 'stats', label: 'Statistiques' },
    { id: 'testimonials', label: 'Avis & Témoignages' },
    { id: 'agenda', label: 'Agenda' },
    { id: 'visits', label: 'Visites du Site' },
  ] as const;

  return (
    <div className="flex gap-2 mb-6 border-b border-accent/20 pb-4 flex-wrap">
      {tabs.map((tab) => (
        <Button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          variant={activeTab === tab.id ? 'default' : 'outline'}
          className={`text-sm font-semibold ${
            activeTab === tab.id
              ? 'bg-accent text-background hover:bg-accent/90'
              : 'border-accent/40 hover:border-accent hover:bg-accent/10'
          }`}
        >
          {tab.label}
        </Button>
      ))}
    </div>
  );
}
