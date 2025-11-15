'use client';

import { Cell, Pie, PieChart as RePieChart } from 'recharts';

import { useIsMobile } from '@/hooks';
import { cn } from '@/lib';
import { ChartContainer } from '@/ui';

const data1 = [
  { name: 'minable', value: 72.1348, fill: 'url(#minable)' },
  { name: 'pre-mine', value: 27.8652, fill: 'url(#pre-mine)' },
];
const data2 = [
  { name: 'minable', value: 72.1348, fill: '#00c871' },
  { name: 'pre-mine', value: 27.8652, fill: '#4856e2' },
];
const data3 = [
  { name: 'minable', value: 72.1348, fill: 'transparent' },
  { name: 'pre-mine', value: 27.8652, fill: 'transparent' },
];
const data4 = [
  { name: 'minable', value: 72.1348, fill: '#05080f' },
  { name: 'pre-mine', value: 27.8652, fill: '#05080f' },
];

export function PieChart() {
  const isMobile = useIsMobile();

  return (
    <ChartContainer config={{}} className="mx-auto aspect-square max-h-[290px] [&_.recharts-text]:fill-background">
      <RePieChart style={{ width: '100%', height: '100%', maxWidth: '290px', aspectRatio: 1 }}>
        <defs>
          <radialGradient id="pre-mine" cx="0%" cy="0%" r="500%">
            <stop offset="0%" stopColor="rgba(72, 86, 226, 0)" />
            <stop offset="90%" stopColor="rgba(72, 86, 226, 1)" />
          </radialGradient>

          <radialGradient id="minable" cx="50%" cy="50%" r="500%">
            <stop offset="0%" stopColor="rgba(0, 200, 113, 0)" />
            <stop offset="90%" stopColor="rgba(0, 200, 113, 1)" />
          </radialGradient>
        </defs>

        <Pie
          data={data4}
          dataKey="value"
          cx="50%"
          cy="50%"
          outerRadius="100%"
          isAnimationActive
          startAngle={0}
          fill="#05080f"
        />
        <Pie
          data={data1}
          dataKey="value"
          cx="50%"
          cy="50%"
          outerRadius="100%"
          isAnimationActive
          paddingAngle={3}
          startAngle={0}
        />
        <Pie
          data={data2}
          dataKey="value"
          cx="50%"
          cy="50%"
          innerRadius="90%"
          outerRadius="100%"
          paddingAngle={3}
          cornerRadius={6}
          isAnimationActive
          startAngle={0}
        />
        <Pie
          data={data3}
          dataKey="value"
          cx="50%"
          cy="50%"
          label={(props) => {
            const { cx, cy, midAngle, innerRadius, outerRadius, label, payload } = props;

            const RADIAN = Math.PI / 180;
            const radius = innerRadius + (outerRadius - innerRadius) / 2;
            const x = cx + radius * Math.cos(-midAngle * RADIAN);
            const y = cy + radius * Math.sin(-midAngle * RADIAN);

            const { name, value } = payload.payload;

            return (
              <text
                x={x}
                y={y}
                fill="white"
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="14"
                fontWeight="bold"
              >
                <tspan
                  dy="1em"
                  x={x}
                  fill={data2.find((d) => d.name === name)?.fill}
                  className={cn('orbitron-body1', { 'orbitron-body2': isMobile })}
                >
                  {value} %
                </tspan>
                <tspan dy="-1em" x={x} className={cn('satoshi-h4', { 'satoshi-h5': isMobile })}>
                  {`${name.at(0).toUpperCase()}${name.slice(1)}`}
                </tspan>
              </text>
            );
          }}
          outerRadius="100%"
          isAnimationActive
          paddingAngle={3}
          startAngle={0}
          labelLine={false}
        >
          {data3.map((_, index) => (
            <Cell key={`cell-${index}`} />
          ))}
        </Pie>
      </RePieChart>
    </ChartContainer>
  );
}
