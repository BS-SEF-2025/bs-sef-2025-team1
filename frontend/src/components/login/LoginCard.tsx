import { Card, CardContent } from "@/components/ui/card";

import LoginHeader from "@/components/login/LoginHeader";
import GoogleLoginButton from "@/components/login/GoogleLoginButton";

interface LoginCardProps {
  assignmentId: string | null;
  isLoading: boolean;
  onGoogleLogin: () => void;
}

const LoginCard = ({
  assignmentId,
  isLoading,
  onGoogleLogin,
}: LoginCardProps) => {
  return (
    <Card className="rounded-[2.5rem] shadow-2xl border border-slate-100 text-center">
      <CardContent className="p-10 space-y-8">
        <LoginHeader assignmentId={assignmentId} />

        <GoogleLoginButton isLoading={isLoading} onClick={onGoogleLogin} />
      </CardContent>
    </Card>
  );
};

export default LoginCard;
