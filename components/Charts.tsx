import React from 'react';

interface ChartDataItem {
    label: string;
    value: number;
    color: string;
}

/**
 * Calculates "nice" grid parameters for a chart's y-axis.
 * @param maxValue The maximum value from the data.
 * @returns An object with a "nice" maximum value for the axis and an array of tick values.
 */
const calculateGridParams = (maxValue: number) => {
    // If max value is 0, create a default grid from 0 to 5.
    if (maxValue <= 0) {
        maxValue = 5;
    }

    // Special handling for small integer max values to ensure a denser grid
    if (maxValue > 0 && maxValue <= 5 && Number.isInteger(maxValue)) {
        const tickValues = Array.from({ length: maxValue + 1 }, (_, i) => i);
        return { niceMaxValue: maxValue, tickValues };
    }

    const numTicks = 5; // Aim for around 5 grid lines.
    const tickSpacing = maxValue / (numTicks - 1);
    const magnitude = Math.pow(10, Math.floor(Math.log10(tickSpacing)));
    const residual = tickSpacing / magnitude;

    let tickStep;
    if (residual > 5) {
        tickStep = 10 * magnitude;
    } else if (residual > 2) {
        tickStep = 5 * magnitude;
    } else if (residual > 1) {
        tickStep = 2 * magnitude;
    } else {
        tickStep = magnitude;
    }

    // Ensure tickStep is at least 1 and is a whole number for clarity on the chart
    tickStep = Math.max(1, Math.round(tickStep));

    const niceMaxValue = Math.ceil(maxValue / tickStep) * tickStep;
    
    const tickValues = [];
    for (let i = 0; i <= niceMaxValue; i += tickStep) {
        tickValues.push(i);
    }
    
    // Handle cases where calculation results in no ticks
    if (tickValues.length < 2) {
        return { niceMaxValue: 1, tickValues: [0, 1] };
    }

    return { niceMaxValue, tickValues };
};


// Bar Chart Component
export const BarChart: React.FC<{ data: ChartDataItem[] }> = ({ data }) => {
    const rawMaxValue = Math.max(...data.map(d => d.value), 0);
    const { niceMaxValue, tickValues } = calculateGridParams(rawMaxValue);
    
    const barWidth = 32;
    const barMargin = 16;
    const yAxisWidth = 30; // Space for labels
    const xAxisHeight = 20; // Space for labels
    const chartHeight = 256;
    const chartWidth = data.length * (barWidth + barMargin);
    const drawableHeight = chartHeight - xAxisHeight;

    return (
        <svg viewBox={`0 0 ${chartWidth + yAxisWidth} ${chartHeight}`} className="w-full h-full" aria-label="Bar chart">
            <g className="grid-y">
                {tickValues.map((value, i) => {
                    const y = drawableHeight - (value / niceMaxValue) * drawableHeight;
                    return (
                        <g key={`grid-line-${i}`}>
                            <line
                                x1={yAxisWidth}
                                x2={chartWidth + yAxisWidth}
                                y1={y}
                                y2={y}
                                className="stroke-slate-300 dark:stroke-slate-600"
                                strokeWidth="1"
                            />
                            <text
                                x={yAxisWidth - 6}
                                y={y + 3} // slight vertical adjustment
                                textAnchor="end"
                                fontSize="10"
                                className="fill-slate-500 dark:fill-slate-400"
                            >
                                {value}
                            </text>
                        </g>
                    );
                })}
            </g>
            {data.map((item, index) => {
                const barHeight = item.value === 0 ? 0 : (item.value / niceMaxValue) * drawableHeight;
                const x = index * (barWidth + barMargin) + yAxisWidth;
                return (
                    <g key={item.label} transform={`translate(${x}, 0)`}>
                        <title>{`${item.label}: ${item.value}`}</title>
                        <rect
                            x="0"
                            y={drawableHeight - barHeight}
                            width={barWidth}
                            height={barHeight}
                            fill={item.color}
                            rx="4"
                        />
                        <text x={barWidth / 2} y={chartHeight - 4} textAnchor="middle" fontSize="10" className="fill-slate-500 dark:fill-slate-400">{item.label}</text>
                    </g>
                );
            })}
        </svg>
    );
};


// Line Chart Component
export const LineChart: React.FC<{ data: ChartDataItem[] }> = ({ data }) => {
    const rawMaxValue = Math.max(...data.map(d => d.value), 0);
    const { niceMaxValue, tickValues } = calculateGridParams(rawMaxValue);
    
    const chartWidth = 400;
    const chartHeight = 256;
    const padding = { top: 20, right: 20, bottom: 25, left: 30 };

    const drawableWidth = chartWidth - padding.left - padding.right;
    const drawableHeight = chartHeight - padding.top - padding.bottom;
    
    // Ensure data has at least 2 points to draw a line, or it will crash on division by zero
    const canDrawLine = data.length > 1;

    const getX = (index: number) => (drawableWidth / (canDrawLine ? data.length - 1 : 1)) * index + padding.left;
    const getY = (value: number) => chartHeight - padding.bottom - (value === 0 ? 0 : (value / niceMaxValue) * drawableHeight);
    
    const points = data.map((item, index) => `${getX(index)},${getY(item.value)}`).join(' ');
    
    return (
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full" aria-label="Line chart">
            <g className="grid-y">
                {tickValues.map((value, i) => {
                    const y = chartHeight - padding.bottom - (value / niceMaxValue) * drawableHeight;
                    return (
                        <g key={`grid-line-${i}`}>
                            <line
                                x1={padding.left}
                                x2={chartWidth - padding.right}
                                y1={y}
                                y2={y}
                                className="stroke-slate-300 dark:stroke-slate-600"
                                strokeWidth="1"
                            />
                            <text
                                x={padding.left - 6}
                                y={y + 3} // slight vertical adjustment
                                textAnchor="end"
                                fontSize="10"
                                className="fill-slate-500 dark:fill-slate-400"
                            >
                                {value}
                            </text>
                        </g>
                    );
                })}
            </g>
            {canDrawLine && (
                 <polyline
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={points}
                />
            )}
            {data.map((item, index) => {
                 const x = getX(index);
                 const y = getY(item.value);
                return (
                    <g key={item.label}>
                         <title>{`${item.label}: ${item.value}`}</title>
                        <circle 
                            cx={x} 
                            cy={y} 
                            r="5" 
                            className="fill-white dark:fill-slate-800"
                            stroke="#f59e0b" 
                            strokeWidth="2" 
                        />
                        <text x={x} y={chartHeight - padding.bottom + 15} textAnchor="middle" fontSize="10" className="fill-slate-500 dark:fill-slate-400">{item.label}</text>
                    </g>
                );
            })}
        </svg>
    );
};

// Pie Chart Component
const PieSlice: React.FC<{ item: ChartDataItem; startAngle: number; endAngle: number; }> = ({ item, startAngle, endAngle }) => {
    const x1 = 50 + 45 * Math.cos(Math.PI * startAngle / 180);
    const y1 = 50 + 45 * Math.sin(Math.PI * startAngle / 180);
    const x2 = 50 + 45 * Math.cos(Math.PI * endAngle / 180);
    const y2 = 50 + 45 * Math.sin(Math.PI * endAngle / 180);
    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

    const pathData = `M 50,50 L ${x1},${y1} A 45,45 0 ${largeArcFlag},1 ${x2},${y2} Z`;

    return (
        <path d={pathData} fill={item.color}>
            <title>{`${item.label}: ${item.value}`}</title>
        </path>
    );
};

export const PieChart: React.FC<{ data: ChartDataItem[] }> = ({ data }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let startAngle = 0;
    
    return (
        <div className="w-full h-full flex flex-col md:flex-row items-center justify-center gap-4">
            <svg viewBox="0 0 100 100" className="w-40 h-40" aria-label="Pie chart">
                {data.map(item => {
                    const angle = (item.value / total) * 360;
                    const slice = <PieSlice key={item.label} item={item} startAngle={startAngle} endAngle={startAngle + angle} />;
                    startAngle += angle;
                    return slice;
                })}
            </svg>
            <div className="flex flex-col space-y-2">
                {data.map(item => (
                    <div key={item.label} className="flex items-center text-sm">
                        <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></span>
                        <span className="text-slate-800 dark:text-slate-200 font-medium">{item.label}</span>
                        <span className="ml-auto text-slate-500 dark:text-slate-400">{total > 0 ? Math.round((item.value / total) * 100) : 0}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
};