import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./dialog";
import { Button } from "./button";
import { Heart, LogIn, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-4">
            <Heart className="h-6 w-6 text-red-500" />
          </div>
          <DialogTitle>Spara dina favoritjobb</DialogTitle>
          <DialogDescription>
            För att spara jobb och komma åt dem senare behöver du vara inloggad på ditt konto.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-3 mt-6">
          <Link to="/auth?mode=login" onClick={onClose}>
            <Button className="w-full bg-primary hover:bg-primary/90 text-white">
              <LogIn className="h-4 w-4 mr-2" />
              Logga in
            </Button>
          </Link>
          
          <Link to="/auth?mode=register" onClick={onClose}>
            <Button variant="outline" className="w-full">
              <UserPlus className="h-4 w-4 mr-2" />
              Skapa konto
            </Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
};