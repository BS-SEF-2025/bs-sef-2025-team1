import { Navigate, Outlet } from "react-router-dom";
import useAuthState from "@/hooks/contexts/useAuthState";

import Sidebar from "@/components/Sidebar";
import useMe from "@/hooks/api/useMe";
import { HttpStatusCode, isAxiosError } from "axios";
import LoadingScreen from "@/components/status/LoadingScreen";
import UnauthorizedScreen from "@/components/status/UnauthorizedScreen";
import ErrorScreen from "@/components/status/ErrorScreen";
import ForbiddenScreen from "@/components/status/ForbiddenScreen";

const ViewComponent = () => {
  const { user, loading } = useAuthState();
  const { isLoading, isError, error } = useMe();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isError) {
    if (isAxiosError(error)) {
      if (error.response?.status === HttpStatusCode.Unauthorized) {
        return <UnauthorizedScreen />;
      }

      if (error.response?.status === HttpStatusCode.Forbidden) {
        return <ForbiddenScreen />;
      }
    }

    return <ErrorScreen />;
  }

  return <Outlet />;
};

const AppLayout = () => {
  return (
    <div className="h-full flex bg-slate-50 select-none">
      <Sidebar />

      <main className="flex-1 h-screen p-6 md:p-10 overflow-x-hidden">
        <div className="max-w-7xl h-full mx-auto">
          <ViewComponent />
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
