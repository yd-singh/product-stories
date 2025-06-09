
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NewsHeader = () => {
  return (
    <div className="border-b border-cred-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <Button asChild variant="ghost" className="text-cred-gray-300 hover:text-cred-gray-100 hover:bg-cred-surface -ml-3">
          <Link to="/" className="flex items-center gap-3">
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">Back</span>
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NewsHeader;
