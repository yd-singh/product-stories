
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface NewsEmptyStateProps {
  type: 'no-articles' | 'no-filtered-results';
  onClearFilters?: () => void;
}

const NewsEmptyState = ({ type, onClearFilters }: NewsEmptyStateProps) => {
  if (type === 'no-articles') {
    return (
      <Card className="cred-surface border-cred-gray-800">
        <CardContent className="p-12 text-center">
          <p className="text-cred-gray-400 text-lg">No news articles available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="cred-surface border-cred-gray-800">
      <CardContent className="p-12 text-center space-y-6">
        <p className="text-cred-gray-400 text-lg">
          No articles match your filters
        </p>
        <Button 
          onClick={onClearFilters}
          className="bg-cred-teal text-cred-black hover:bg-cred-teal/90 font-medium"
        >
          Clear Filters
        </Button>
      </CardContent>
    </Card>
  );
};

export default NewsEmptyState;
