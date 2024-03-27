import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function SalesChart({ salesData }) {
  const options = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    stacked: false,
    plugins: {
      title: {
        display: true,
        text: "Sales & Order Data",
      },
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  // Extracting labels and data from salesData
  const labels = salesData?.map((data) => data?.date);
  const sales = salesData?.map((data) => data?.sales);
  const numOrders = salesData?.map((data) => data?.numOrders);

  const data = {
    labels,
    datasets: [
      {
        label: 'Sales',
        data: sales,
        borderColor: '#198753',
        backgroundColor: 'rgba(42, 117, 83, 0.5)',
        yAxisID: 'y',
      },
      {
        label: 'Orders',
        data: numOrders,
        borderColor: 'rgb(220, 52, 69)',
        backgroundColor: 'rgba(201, 68, 82, 0.5)',
        yAxisID: 'y1',
      },
    ],
  };

  return <Line options={options} data={data} />;
}
