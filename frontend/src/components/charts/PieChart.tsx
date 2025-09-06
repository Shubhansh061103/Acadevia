'use client';

import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
    data: Array<{ subject: string; value: number; color: string }>;
    height?: number;
}

export function PieChart({ data, height = 300 }: PieChartProps) {
    const chartData = {
        labels: data.map(d => d.subject),
        datasets: [
            {
                data: data.map(d => d.value),
                backgroundColor: data.map(d => d.color),
                borderColor: '#fff',
                borderWidth: 2,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right' as const,
                labels: {
                    padding: 15,
                    usePointStyle: true,
                    font: {
                        size: 12,
                    },
                },
            },
            tooltip: {
                backgroundColor: 'rgb(31, 41, 55)',
                titleColor: 'rgb(255, 255, 255)',
                bodyColor: 'rgb(255, 255, 255)',
                borderColor: 'rgb(75, 85, 99)',
                borderWidth: 1,
                callbacks: {
                    label: function (context: any) {
                        return context.label + ': ' + context.parsed + '%';
                    },
                },
            },
        },
    };

    return (
        <div style={{ height }}>
            <Pie data={chartData} options={options} />
        </div>
    );
}