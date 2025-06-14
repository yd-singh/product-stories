
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Rss, Plus } from "lucide-react";

interface EmptyTopicsStateProps {
  onAddTopic: () => void;
}

const EmptyTopicsState = ({ onAddTopic }: EmptyTopicsStateProps) => {
  return (
    <Card className="cred-surface-elevated border-cred-gray-700">
      <CardContent className="p-8 text-center">
        <Rss className="w-12 h-12 text-cred-gray-600 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-cred-gray-300 mb-2">No Topics Yet</h3>
        <p className="text-cred-gray-500 mb-4">
          Create your first topic to start personalizing your news experience.
        </p>
        <Button
          onClick={onAddTopic}
          className="bg-cred-teal hover:bg-cred-teal/90 text-black"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Your First Topic
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmptyTopicsState;
