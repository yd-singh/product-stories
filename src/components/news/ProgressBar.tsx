
interface ProgressBarProps {
  currentIndex: number;
  total: number;
}

const ProgressBar = ({ currentIndex, total }: ProgressBarProps) => {
  const percentage = ((currentIndex + 1) / total) * 100;
  
  return (
    <div className="space-y-2">
      <div className="w-full bg-cred-gray-800 rounded-full h-1">
        <div
          className="bg-cred-teal h-1 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-cred-gray-500">
        <span>Progress</span>
        <span>{Math.round(percentage)}%</span>
      </div>
    </div>
  );
};

export default ProgressBar;
