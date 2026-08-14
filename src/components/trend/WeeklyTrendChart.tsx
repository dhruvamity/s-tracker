import React, { useState } from 'react';
import { WeekTrend } from '../../types/attendance';
import { THEME_COLORS } from '../../constants/config';
import { Info } from '@phosphor-icons/react';

interface WeeklyTrendChartProps {
  trends: WeekTrend[];
  targetPercent: number;
}

export const WeeklyTrendChart: React.FC<WeeklyTrendChartProps> = ({ trends, targetPercent }) => {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  if (!trends || trends.length === 0) {
    return (
      <section style={{
        padding: '24px',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--color-surface)',
        border: '1px solid rgba(233, 233, 237, 0.05)',
        textAlign: 'center',
        color: 'var(--color-neutral-400)'
      }}>
        No attendance trend data available yet.
      </section>
    );
  }

  // Chart dimensions & scaling
  const width = 720;
  const height = 260;
  const padLeft = 46;
  const padRight = 36;
  const padTop = 32;
  const padBottom = 42;

  const chartWidth = width - padLeft - padRight;
  const chartHeight = height - padTop - padBottom;

  // Y scale: 40% to 100% to give nice visual dynamic range
  const minY = 40;
  const maxY = 100;

  const getY = (pct: number) => {
    const clamped = Math.max(minY, Math.min(maxY, pct));
    return padTop + chartHeight - ((clamped - minY) / (maxY - minY)) * chartHeight;
  };

  const getX = (index: number) => {
    if (trends.length === 1) return padLeft + chartWidth / 2;
    return padLeft + (index / (trends.length - 1)) * chartWidth;
  };

  // Coordinates for all points
  const points = trends.map((t, idx) => ({
    x: getX(idx),
    y: getY(t.pct),
    data: t,
    index: idx
  }));

  // Generate smooth cubic bezier path
  const generateSmoothPath = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return '';
    if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;

    let path = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i];
      const p1 = pts[i + 1];
      const cx1 = p0.x + (p1.x - p0.x) * 0.45;
      const cy1 = p0.y;
      const cx2 = p0.x + (p1.x - p0.x) * 0.55;
      const cy2 = p1.y;
      path += ` C ${cx1} ${cy1}, ${cx2} ${cy2}, ${p1.x} ${p1.y}`;
    }
    return path;
  };

  const linePath = generateSmoothPath(points);
  const baselineY = padTop + chartHeight;
  const areaPath = points.length > 0
    ? `${linePath} L ${points[points.length - 1].x} ${baselineY} L ${points[0].x} ${baselineY} Z`
    : '';

  const targetY = getY(targetPercent);

  // Active selected or hovered week
  const currentHover = activeIdx !== null ? points[activeIdx] : null;

  // Grid levels (60%, 75%, 90%, 100%)
  const yTicks = [50, 75, 100];

  return (
    <section style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      padding: 'clamp(16px, 2.5vw, 24px)',
      borderRadius: 'var(--radius-lg)',
      background: 'var(--color-surface)',
      boxShadow: 'var(--shadow-sm)',
      border: '1px solid rgba(233, 233, 237, 0.05)',
      position: 'relative'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            Weekly Attendance Trend
          </h3>
          <span style={{ fontSize: '12px', color: 'var(--color-neutral-400)' }}>
            Weekly performance vs {targetPercent}% requirement
          </span>
        </div>

        {currentHover && (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '5px 12px',
            borderRadius: '8px',
            background: 'rgba(145, 132, 217, 0.12)',
            border: '1px solid rgba(145, 132, 217, 0.22)',
            fontSize: '12px',
            color: 'var(--color-accent-200)',
            animation: 'fadeIn 0.15s ease'
          }}>
            <span>Week of <strong>{currentHover.data.label}</strong>:</span>
            <span style={{
              fontWeight: 600,
              color: currentHover.data.pct >= targetPercent ? THEME_COLORS.GREEN_BRIGHT : THEME_COLORS.AMBER
            }}>
              {currentHover.data.pct.toFixed(1)}%
            </span>
            <span style={{ color: 'var(--color-neutral-400)', fontSize: '11px' }}>
              ({currentHover.data.attended}/{currentHover.data.totalHeld} attended)
            </span>
            {currentHover.data.isBaseline && (
              <span style={{
                fontSize: '10px',
                padding: '1px 6px',
                borderRadius: '4px',
                background: 'rgba(145, 132, 217, 0.25)',
                color: 'var(--color-accent-300)',
                textTransform: 'uppercase',
                letterSpacing: '.05em'
              }}>
                Past
              </span>
            )}
          </div>
        )}
      </div>

      {/* SVG Chart Container */}
      <div style={{
        position: 'relative',
        width: '100%',
        background: 'rgba(11, 12, 20, 0.35)',
        borderRadius: 'var(--radius-md)',
        padding: '10px 6px',
        border: '1px solid rgba(233, 233, 237, 0.03)',
        overflow: 'hidden'
      }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}
        >
          <defs>
            {/* Soft vertical gradient for area fill */}
            <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.38" />
              <stop offset="60%" stopColor="var(--color-accent)" stopOpacity="0.10" />
              <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.0" />
            </linearGradient>

            {/* Glowing line filter */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="var(--color-accent)" floodOpacity="0.45" />
            </filter>
          </defs>

          {/* Horizontal grid lines & Y labels */}
          {yTicks.map((tick) => {
            const y = getY(tick);
            return (
              <g key={tick}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={width - padRight}
                  y2={y}
                  stroke="rgba(233, 233, 237, 0.06)"
                  strokeDasharray={tick === targetPercent ? 'none' : '3 3'}
                  strokeWidth="1"
                />
                <text
                  x={padLeft - 8}
                  y={y + 3.5}
                  textAnchor="end"
                  fill="var(--color-neutral-600)"
                  fontSize="10"
                  fontFamily="var(--font-heading)"
                  fontWeight="500"
                  style={{ fontVariantNumeric: 'tabular-nums' }}
                >
                  {tick}%
                </text>
              </g>
            );
          })}

          {/* Target Line Badge & Guideline */}
          <line
            x1={padLeft}
            y1={targetY}
            x2={width - padRight}
            y2={targetY}
            stroke="var(--color-accent-600)"
            strokeDasharray="4 4"
            strokeWidth="1.5"
            opacity="0.8"
          />
          <rect
            x={width - padRight - 78}
            y={targetY - 10}
            width="78"
            height="18"
            rx="4"
            fill="var(--color-surface)"
            stroke="var(--color-accent-700)"
            strokeWidth="1"
          />
          <text
            x={width - padRight - 39}
            y={targetY + 2.5}
            textAnchor="middle"
            fill="var(--color-accent-300)"
            fontSize="9.5"
            fontWeight="600"
            fontFamily="var(--font-heading)"
            letterSpacing="0.04em"
          >
            {targetPercent}% TARGET
          </text>

          {/* Gradient Area Fill */}
          <path
            d={areaPath}
            fill="url(#trendGradient)"
          />

          {/* Main Trend Line */}
          <path
            d={linePath}
            fill="none"
            stroke="var(--color-accent-400)"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow)"
          />

          {/* Interactive Column Click/Hover targets & Data Points */}
          {points.map((pt, idx) => {
            const isHovered = activeIdx === idx;
            const isAboveTarget = pt.data.pct >= targetPercent;
            const dotColor = pt.data.isBaseline
              ? 'var(--color-accent-300)'
              : isAboveTarget
              ? THEME_COLORS.GREEN_BRIGHT
              : THEME_COLORS.AMBER;

            return (
              <g
                key={pt.data.weekKey}
                onMouseEnter={() => setActiveIdx(idx)}
                onMouseLeave={() => setActiveIdx(null)}
                style={{ cursor: 'pointer' }}
              >
                {/* Vertical hover guide bar */}
                {isHovered && (
                  <line
                    x1={pt.x}
                    y1={padTop}
                    x2={pt.x}
                    y2={baselineY}
                    stroke="rgba(145, 132, 217, 0.35)"
                    strokeWidth="1.5"
                    strokeDasharray="2 2"
                  />
                )}

                {/* Broad transparent hit area for easy touch/mouse hover */}
                <rect
                  x={pt.x - (chartWidth / (trends.length || 1)) / 2}
                  y={padTop}
                  width={chartWidth / (trends.length || 1)}
                  height={chartHeight}
                  fill="transparent"
                />

                {/* Outer Ring on Hover */}
                {isHovered && (
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="9"
                    fill="none"
                    stroke={dotColor}
                    strokeWidth="2"
                    opacity="0.8"
                  />
                )}

                {/* Data Dot Node */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? '6' : '4.5'}
                  fill="var(--color-surface)"
                  stroke={dotColor}
                  strokeWidth="2.5"
                  style={{ transition: 'all 0.15s ease' }}
                />

                {/* Percentage label above dot on hover */}
                <text
                  x={pt.x}
                  y={pt.y - 10}
                  textAnchor="middle"
                  fill={isHovered ? 'var(--color-text)' : 'var(--color-neutral-400)'}
                  fontSize={isHovered ? '11.5' : '10'}
                  fontWeight={isHovered ? '700' : '500'}
                  fontFamily="var(--font-heading)"
                  style={{ fontVariantNumeric: 'tabular-nums' }}
                >
                  {Math.round(pt.data.pct)}%
                </text>

                {/* X Axis Label */}
                <text
                  x={pt.x}
                  y={baselineY + 18}
                  textAnchor="middle"
                  fill={isHovered ? 'var(--color-accent-200)' : 'var(--color-neutral-500)'}
                  fontSize="10.5"
                  fontWeight={isHovered ? '600' : '400'}
                  fontFamily="var(--font-heading)"
                >
                  {pt.data.label}
                </text>

                {/* Past tag under baseline weeks */}
                {pt.data.isBaseline && (
                  <text
                    x={pt.x}
                    y={baselineY + 29}
                    textAnchor="middle"
                    fill="var(--color-neutral-600)"
                    fontSize="8"
                    letterSpacing="0.06em"
                    fontWeight="600"
                    fontFamily="var(--font-heading)"
                  >
                    PAST
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Summary Footer */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '11.5px',
        color: 'var(--color-neutral-500)',
        paddingTop: '2px'
      }}>
        <Info size={14} color="var(--color-accent)" style={{ flex: 'none' }} />
        <span>
          Interactive line graph shows weekly trajectory. Tap or hover over any week point to view detailed held vs. attended lecture metrics.
        </span>
      </div>
    </section>
  );
};

