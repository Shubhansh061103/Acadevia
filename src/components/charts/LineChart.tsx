'use client';

import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

interface LineChartProps {
    data: Array<{ day: string; score: number }>;
    height?: number;
}

export function LineChart({ data, height = 300 }: LineChartProps) {
    const chartData = {
        labels: data.map(d => d.day),
        datasets: [
            {
                label: 'Score',
                data: data.map(d => d.score),
                fill: true,
                backgroundColor: 'rgba(147, 51, 234, 0.1)',
                borderColor: 'rgb(147, 51, 234)',
                borderWidth: 2,
                pointBackgroundColor: 'rgb(147, 51, 234)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
                tension: 0.4,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                mode: 'index' as const,
                intersect: false,
                backgroundColor: 'rgb(31, 41, 55)',
                titleColor: 'rgb(255, 255, 255)',
                bodyColor: 'rgb(255, 255, 255)',
                borderColor: 'rgb(75, 85, 99)',
                borderWidth: 1,
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
            },
            y: {
                beginAtZero: true,
                max: 100,
                ticks: {
                    callback: function (value: any) {
                        return value + '%';
                    },
                },
            },
        },
    };

    return (
        <div style={{ height }}>
            <Line data={chartData} options={options} />
        </div>
    );
}