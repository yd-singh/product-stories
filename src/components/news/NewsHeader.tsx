import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { User, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const NewsHeader = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <header className="border-b border-cred-gray-800 bg-cred-black/95 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-cred-teal to-cred-purple rounded-lg flex items-center justify-center">
                <span className="text-sm font-bold text-white">N</span>
              </div>
              <h1 className="text-xl font-bold text-cred-gray-100">News Platform</h1>
            </div>
            
            <nav className="hidden md:flex items-center gap-6">
              <Button
                variant="ghost"
                onClick={() => navigate('/news')}
                className="text-cred-gray-300 hover:text-cred-gray-100 hover:bg-cred-surface"
              >
                News
              </Button>
              {user && (
                <Button
                  variant="ghost"
                  onClick={() => navigate('/profile')}
                  className="text-cred-gray-300 hover:text-cred-gray-100 hover:bg-cred-surface"
                >
                  Profile
                </Button>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 text-cred-gray-300 hover:text-cred-gray-100">
                    <User className="w-4 h-4" />
                    <span className="hidden md:inline">{user.email}</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="bg-cred-surface border-cred-gray-700 text-cred-gray-100"
                >
                  <DropdownMenuItem 
                    onClick={() => navigate('/profile')}
                    className="hover:bg-cred-gray-800 cursor-pointer"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-cred-gray-700" />
                  <DropdownMenuItem 
                    onClick={handleSignOut}
                    className="hover:bg-cred-gray-800 cursor-pointer text-red-400"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={() => navigate('/auth')}
                className="bg-cred-teal hover:bg-cred-teal/90 text-black font-medium"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default NewsHeader;
