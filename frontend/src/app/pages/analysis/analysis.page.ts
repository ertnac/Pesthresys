import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { DataService } from '../../services/data.service';
import { Subscription } from 'rxjs';

Chart.register(...registerables);
Chart.register(...registerables, zoomPlugin);

@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.page.html',
  styleUrls: ['./analysis.page.scss'],
})
export class AnalysisPage implements AfterViewInit, OnDestroy {
  selectedRange: 'hourly' | 'daily' | 'weekly' = 'daily';
  chart: Chart | undefined;
  chartSubtitle: string = '';
  private dataSubscription: Subscription | undefined;

  constructor(private dataService: DataService) {}

  ngAfterViewInit() {
    // Subscribe to data changes
    this.dataSubscription = this.dataService.history$.subscribe(() => {
      if (this.chart) {
        this.updateChart();
      } else {
        this.loadChart();
      }
    });
  }

  ngOnDestroy() {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  // Process scan data for the chart
  getChartData() {
    const scans = this.dataService.getAllScans();
    const now = new Date();

    if (this.selectedRange === 'hourly') {
      // Group scans by hour for today
      const hourlyData: {[key: string]: number[]} = {};
      const labels: string[] = [];
      
      // Initialize for current day hours
      for (let h = 0; h <= now.getHours(); h++) {
        const hourKey = h.toString().padStart(2, '0') + ':00';
        labels.push(hourKey);
        hourlyData[hourKey] = [];
      }
      
      // Process today's scans
      scans.forEach(scan => {
        const scanDate = new Date(scan.date);
        if (
          scanDate.getDate() === now.getDate() &&
          scanDate.getMonth() === now.getMonth() &&
          scanDate.getFullYear() === now.getFullYear()
        ) {
          const hourKey = scanDate.getHours().toString().padStart(2, '0') + ':00';
          if (hourlyData[hourKey]) {
            // Calculate average severity for this scan
            const severity = this.calculateScanSeverity(scan);
            hourlyData[hourKey].push(severity);
          }
        }
      });
      
      // Calculate average for each hour
      const data = labels.map(hour => {
        const values = hourlyData[hour];
        if (values.length === 0) return 0;
        return values.reduce((sum, val) => sum + val, 0) / values.length;
      });
      
      this.chartSubtitle = now.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
      
      return { labels, data };
      
    } else if (this.selectedRange === 'daily') {
      // Last 7 days
      const labels: string[] = [];
      const dailyData: {[key: string]: number[]} = {};
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(now.getDate() - i);
        const dateKey = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        labels.push(dateKey);
        dailyData[dateKey] = [];
      }
      
      // Process scans from the last 7 days
      scans.forEach(scan => {
        const scanDate = new Date(scan.date);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(now.getDate() - 6);
        sevenDaysAgo.setHours(0, 0, 0, 0);
        
        if (scanDate >= sevenDaysAgo) {
          const dateKey = scanDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          if (dailyData[dateKey]) {
            const severity = this.calculateScanSeverity(scan);
            dailyData[dateKey].push(severity);
          }
        }
      });
      
      // Calculate average for each day
      const data = labels.map(day => {
        const values = dailyData[day];
        if (values.length === 0) return 0;
        return values.reduce((sum, val) => sum + val, 0) / values.length;
      });
      
      this.chartSubtitle = now.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      });
      
      return { labels, data };
      
    } else {
      // Weekly data for current month
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const weekLabels: string[] = [];
      const weeklyData: {[key: number]: number[]} = {};
      let weekCount = 1;
      
      // Initialize weekly data
      while (firstDay.getMonth() === now.getMonth()) {
        weekLabels.push(`Week ${weekCount}`);
        weeklyData[weekCount] = [];
        firstDay.setDate(firstDay.getDate() + 7);
        weekCount++;
      }
      
      // Process scans for current month
      scans.forEach(scan => {
        const scanDate = new Date(scan.date);
        if (scanDate.getMonth() === now.getMonth() && scanDate.getFullYear() === now.getFullYear()) {
          // Determine which week of the month
          const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
          const weekOfMonth = Math.floor((scanDate.getDate() + firstDayOfMonth.getDay() - 1) / 7) + 1;
          
          if (weeklyData[weekOfMonth]) {
            const severity = this.calculateScanSeverity(scan);
            weeklyData[weekOfMonth].push(severity);
          }
        }
      });
      
      // Calculate average for each week
      const data = weekLabels.map((_, index) => {
        const weekNum = index + 1;
        const values = weeklyData[weekNum];
        if (!values || values.length === 0) return 0;
        return values.reduce((sum, val) => sum + val, 0) / values.length;
      });
      
      this.chartSubtitle = now.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      });
      
      return { labels: weekLabels, data };
    }
  }

  // Calculate severity percentage for a scan
  calculateScanSeverity(scan: any): number {
    if (scan.status === 'healthy') return 10;
    if (scan.status === 'watchlist') return 40;
    if (scan.status === 'infected') {
      // If there are pests, calculate based on severity
      if (scan.pestsDetected && scan.pestsDetected.length > 0) {
        const highSeverityCount = scan.pestsDetected.filter(
          (pest: any) => pest.severity === 'High'
        ).length;
        const mediumSeverityCount = scan.pestsDetected.filter(
          (pest: any) => pest.severity === 'Medium'
        ).length;
        
        // Weighted calculation
        return Math.min(100, 60 + (highSeverityCount * 20) + (mediumSeverityCount * 10));
      }
      return 70; // Default infected value
    }
    return 0;
  }

  loadChart() {
    const ctx = document.getElementById('plantStatsChart') as HTMLCanvasElement;
    const chartData = this.getChartData();

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: chartData.labels,
        datasets: [
          {
            label: 'Average Severity Level (%)',
            data: chartData.data,
            fill: false,
            borderColor: '#4CAF50',
            tension: 0.4,
            pointBackgroundColor: '#FF5722',
            pointRadius: 6,
            pointHoverRadius: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'nearest',
          axis: 'x',
          intersect: false,
        },
        scales: {
          x: {
            title: {
              display: true,
              text: this.getXAxisTitle(),
            },
          },
          y: {
            title: {
              display: true,
              text: 'Severity Level (%)',
            },
            min: 0,
            max: 100,
          },
        },
        plugins: {
          tooltip: {
            enabled: true,
            callbacks: {
              label: (context) => `Avg. Severity: ${context.parsed.y.toFixed(1)}%`,
            },
          },
          legend: {
            display: false,
          },
          zoom: {
            pan: {
              enabled: true,
              mode: 'x',
            },
            zoom: {
              wheel: {
                enabled: true,
              },
              pinch: {
                enabled: true,
              },
              mode: 'x',
            },
          },
        },
      },
    });
  }

  updateChart() {
    if (this.chart) {
      const chartData = this.getChartData();
      this.chart.data.labels = chartData.labels;
      this.chart.data.datasets[0].data = chartData.data;
      if (this.chart.options.scales?.['x']) {
        (this.chart.options.scales['x'] as any).title = {
          text: this.getXAxisTitle(),
        };
      }
      this.chart.update();
    }
  }

  getXAxisTitle() {
    if (this.selectedRange === 'hourly') return 'Hour of Day';
    if (this.selectedRange === 'daily') return 'Date';
    return 'Week of Month';
  }
}