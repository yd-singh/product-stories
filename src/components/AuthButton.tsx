
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AuthButton = () => {
  const { user, signOut } = useAuth();

  if (!user) {
    return (
      <Button asChild variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
        <Link to="/auth">
          <User className="w-4 h-4 mr-2" />
          Sign In
        </Link>
      </Button>
    );
  }

  return (
    <Button 
      onClick={signOut}
      variant="outline" 
      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
    >
      <LogOut className="w-4 h-4 mr-2" />
      Sign Out
    </Button>
  );
};
