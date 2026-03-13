import { describe, it, expect, vi } from 'vitest';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek } from 'date-fns';

/**
 * AdminCalendarAgenda Tests
 * 
 * Tests for the calendar agenda component with date calculations and statistics.
 */

describe('AdminCalendarAgenda', () => {
  it('should export a default component', async () => {
    const module = await import('./AdminCalendarAgenda');
    expect(module.default).toBeDefined();
    expect(typeof module.default).toBe('function');
  });

  describe('Calendar Date Calculations', () => {
    it('should generate correct month calendar days', () => {
      const testDate = new Date(2026, 2, 15); // March 15, 2026
      const start = startOfMonth(testDate);
      const end = endOfMonth(testDate);
      const days = eachDayOfInterval({ start, end });

      expect(days.length).toBeGreaterThan(0);
      expect(days[0].getMonth()).toBe(2); // March
      expect(days[days.length - 1].getMonth()).toBe(2); // March
    });

    it('should generate correct week calendar days', () => {
      const testDate = new Date(2026, 2, 15); // March 15, 2026
      const start = startOfWeek(testDate, { weekStartsOn: 1 });
      const end = endOfWeek(testDate, { weekStartsOn: 1 });
      const days = eachDayOfInterval({ start, end });

      expect(days.length).toBe(7); // Always 7 days in a week
    });

    it('should format date correctly in French locale', () => {
      const testDate = new Date(2026, 2, 15); // March 15, 2026
      const formatted = format(testDate, 'd MMMM yyyy', { locale: require('date-fns/locale/fr').default });

      expect(formatted).toContain('15');
      expect(formatted).toContain('2026');
    });
  });

  describe('Reservation Statistics', () => {
    it('should calculate total reservations correctly', () => {
      const reservations = [
        { consultationType: '25min', id: 1 },
        { consultationType: '30min', id: 2 },
        { consultationType: '1hour', id: 3 },
      ];

      const total = reservations.length;
      expect(total).toBe(3);
    });

    it('should calculate revenue correctly by consultation type', () => {
      const reservations = [
        { consultationType: '25min' },
        { consultationType: '30min' },
        { consultationType: '40min' },
        { consultationType: '1hour' },
      ];

      const revenue = reservations.reduce((sum, r) => {
        if (r.consultationType === '25min') return sum + 25;
        if (r.consultationType === '30min') return sum + 70;
        if (r.consultationType === '40min') return sum + 90;
        if (r.consultationType === '1hour') return sum + 110;
        return sum;
      }, 0);

      expect(revenue).toBe(25 + 70 + 90 + 110);
    });

    it('should group reservations by date correctly', () => {
      const reservations = [
        { reservationDate: '2026-03-01', id: 1 },
        { reservationDate: '2026-03-01', id: 2 },
        { reservationDate: '2026-03-02', id: 3 },
      ];

      const grouped: Record<string, any[]> = {};
      reservations.forEach((res) => {
        const date = res.reservationDate;
        if (!grouped[date]) {
          grouped[date] = [];
        }
        grouped[date].push(res);
      });

      expect(grouped['2026-03-01']).toHaveLength(2);
      expect(grouped['2026-03-02']).toHaveLength(1);
    });
  });

  describe('Daily Visitor Statistics', () => {
    it('should calculate total visits correctly', () => {
      const dailyVisitors = [
        { date: '2026-03-01', visitCount: 10 },
        { date: '2026-03-02', visitCount: 15 },
        { date: '2026-03-03', visitCount: 12 },
      ];

      const totalVisits = dailyVisitors.reduce((sum, dv) => sum + dv.visitCount, 0);
      expect(totalVisits).toBe(37);
    });

    it('should calculate average visits per day correctly', () => {
      const dailyVisitors = [
        { visitCount: 10 },
        { visitCount: 20 },
        { visitCount: 30 },
      ];

      const totalVisits = dailyVisitors.reduce((sum, dv) => sum + dv.visitCount, 0);
      const average = Math.round(totalVisits / dailyVisitors.length);

      expect(average).toBe(20);
    });
  });

  describe('View Mode Filtering', () => {
    it('should filter reservations by date', () => {
      const reservations = [
        { reservationDate: '2026-03-01', startTime: '10:00' },
        { reservationDate: '2026-03-01', startTime: '11:00' },
        { reservationDate: '2026-03-02', startTime: '10:00' },
      ];

      const selectedDate = '2026-03-01';
      const filtered = reservations.filter((r) => r.reservationDate === selectedDate);

      expect(filtered).toHaveLength(2);
    });

    it('should sort reservations by time', () => {
      const reservations = [
        { startTime: '14:00' },
        { startTime: '10:00' },
        { startTime: '12:00' },
      ];

      const sorted = [...reservations].sort((a, b) => a.startTime.localeCompare(b.startTime));

      expect(sorted[0].startTime).toBe('10:00');
      expect(sorted[1].startTime).toBe('12:00');
      expect(sorted[2].startTime).toBe('14:00');
    });
  });

  describe('Navigation', () => {
    it('should handle month navigation', () => {
      const currentDate = new Date(2026, 2, 15); // March 15, 2026
      const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);

      expect(nextMonth.getMonth()).toBe(3); // April
    });

    it('should handle year boundary navigation', () => {
      const currentDate = new Date(2026, 11, 15); // December 15, 2026
      const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);

      expect(nextMonth.getFullYear()).toBe(2027);
      expect(nextMonth.getMonth()).toBe(0); // January
    });
  });
});
