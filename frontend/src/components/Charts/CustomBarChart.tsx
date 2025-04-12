import React from "react";
import {
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Bar,
  Cell,
} from "recharts";
import { barChart } from "../../utils/interfaces";

// Custom text component for X-axis labels with colored tspans
const CustomXAxisTick = (props: any) => {
  const { x, y, payload } = props;

  // Determine color based on priority
  const getTextColor = (value: string) => {
    switch (value) {
      case "High":
        return "#FF0000";
      case "Medium":
        return "#FFD700";
      case "Low":
        return "#00FF00";
      default:
        return "#888888";
    }
  };

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={16}
        textAnchor="middle"
        fill={getTextColor(payload.value)}
      >
        <tspan fill={getTextColor(payload.value)} fontSize="14px">
          {payload.value}
        </tspan>
      </text>
    </g>
  );
};

// Custom text component for Y-axis labels
const CustomYAxisTick = (props: any) => {
  const { x, y, payload } = props;

  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={0} textAnchor="end" fill="#555">
        <tspan fontSize="14px" fill="#555">
          {payload.value}
        </tspan>
      </text>
    </g>
  );
};

const CustomBarChart: React.FC<barChart> = ({ data }) => {
  const getBarColor = (entry: any) => {
    switch (entry?.priority) {
      case "High":
        return "#FF0000";
      case "Medium":
        return "#FFD700";
      case "Low":
        return "#00FF00";
      default:
        return "#888888";
    }
  };

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height={330}>
        <BarChart data={data}>
          <CartesianGrid stroke="none" />
          <XAxis dataKey="priority" stroke="none" tick={<CustomXAxisTick />} />
          <YAxis dataKey="count" stroke="none" tick={<CustomYAxisTick />} />
          <Tooltip
            contentStyle={{ borderRadius: "8px" }}
            labelStyle={{ color: "#333", fontWeight: "bold" }}
          />
          <Bar
            name="Priority Count"
            dataKey="count"
            fill="#ff8042"
            radius={[10, 10, 0, 0]}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={getBarColor(entry)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomBarChart;
