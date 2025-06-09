
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface NewsErrorStateProps {
  error: Error;
}

const NewsErrorState = ({ error }: NewsErrorStateProps) => {
  return (
    <div className="min-h-screen bg-cred-black flex items-center justify-center">
      <div className="text-center space-y-6">
        <p className="text-red-400 text-lg font-medium">Error loading news</p>
        <p className="text-cred-gray-400 text-sm">{error.message}</p>
        <Button asChild variant="outline" className="border-cred-gray-700 text-cred-gray-100 hover:bg-cred-surface">
          <Link to="/">Back to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
};

export default NewsErrorState;
