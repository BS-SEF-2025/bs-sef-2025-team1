import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  message?: string;
  onRetry?: () => void;
}

const ErrorScreen = ({ message, onRetry }: Props) => {
  return (
    <div className="h-full w-full flex items-center justify-center bg-slate-50 p-6">
      <div className="text-center space-y-6 max-w-md">
        <AlertCircle className="w-14 h-14 text-rose-500 mx-auto" />

        <div>
          <h1 className="text-2xl font-black text-slate-900 mb-2">
            אירעה שגיאה
          </h1>
          <p className="text-slate-500 font-medium">
            {message ?? "משהו השתבש. נסה שוב מאוחר יותר."}
          </p>
        </div>

        {onRetry && (
          <Button onClick={onRetry} className="rounded-xl cursor-pointer">
            נסה שוב
          </Button>
        )}
      </div>
    </div>
  );
};

export default ErrorScreen;
