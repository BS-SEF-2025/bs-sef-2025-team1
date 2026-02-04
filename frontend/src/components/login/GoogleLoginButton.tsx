import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import googleLogo from "/google-logo.svg";

interface GoogleLoginButtonProps {
  isLoading: boolean;
  onClick: () => void;
}

const GoogleLoginButton = ({ isLoading, onClick }: GoogleLoginButtonProps) => {
  return (
    <Button
      onClick={onClick}
      disabled={isLoading}
      variant="outline"
      className={cn(
        "w-full h-14 gap-4 rounded-2xl font-black text-base cursor-pointer",
        "border-2 border-slate-100 hover:bg-slate-50 hover:border-indigo-200",
        "shadow-lg shadow-slate-100",
      )}
    >
      {isLoading ? (
        <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      ) : (
        <img src={googleLogo} alt="Google" className="w-6 h-6" />
      )}
      התחברות עם Google
    </Button>
  );
};

export default GoogleLoginButton;
