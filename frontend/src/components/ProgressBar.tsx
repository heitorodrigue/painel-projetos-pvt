interface ProgressBarProps {
  percentage: number;
}

export default function ProgressBar({
  percentage,
}: ProgressBarProps) {
  const width = Math.min(Math.max(percentage, 0), 100);

  return (
    <div className="progress-container">
      <div
        className="progress-bar"
        style={{ width: `${width}%` }}
      />
    </div>
  );
}