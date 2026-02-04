import LoadingScreen from "@/components/status/LoadingScreen";
import useAuthState from "@/hooks/contexts/useAuthState";
import { Navigate, useParams } from "react-router-dom";

const DirectSubmitPage = () => {
  const { assignment } = useParams<{ assignment: string }>();

  const { user, loading } = useAuthState();

  if (!assignment) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to={`/login?assignment=${assignment}`} replace />;
  }

  return <Navigate to={`/submit/${assignment}`} replace />;
};

export default DirectSubmitPage;
