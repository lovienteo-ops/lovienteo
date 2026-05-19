interface Point { x: number; y: number; label: string; }
interface Props  { points: Point[]; }

export default function Heatmap({ points }: Props) {
  if (!points.length) {
    return (
      <div className="heatmap-empty">
        <span>Sin datos de clicks todavía</span>
      </div>
    );
  }

  /* bucket into a 20x20 grid */
  const grid: number[][] = Array.from({ length: 20 }, () => Array(20).fill(0));
  points.forEach(p => {
    const gx = Math.min(19, Math.floor(p.x / 5));
    const gy = Math.min(19, Math.floor(p.y / 5));
    grid[gy][gx]++;
  });
  const max = Math.max(...grid.flat(), 1);

  return (
    <div className="heatmap-wrap">
      <div className="heatmap-grid">
        {grid.map((row, gy) =>
          row.map((val, gx) => {
            const intensity = val / max;
            const alpha     = intensity * 0.92;
            const r = Math.round(245 * intensity + 10 * (1 - intensity));
            const g = Math.round(197 * intensity * (1 - intensity * 0.7));
            const b = Math.round(24  * intensity);
            return (
              <div
                key={`${gy}-${gx}`}
                className="heatmap-cell"
                title={val > 0 ? `${val} click${val > 1 ? 's' : ''} en esta zona` : ''}
                style={{
                  background: val > 0 ? `rgba(${r},${g},${b},${alpha})` : 'transparent',
                  gridColumn: gx + 1,
                  gridRow:    gy + 1,
                }}
              />
            );
          })
        )}
      </div>

      {/* legend */}
      <div className="heatmap-legend">
        <span>Sin actividad</span>
        <div className="heatmap-gradient" />
        <span>Alta actividad</span>
      </div>

      <p className="heatmap-note">
        {points.length} clicks registrados &mdash; cuadrícula 20×20 sobre viewport relativo
      </p>
    </div>
  );
}
