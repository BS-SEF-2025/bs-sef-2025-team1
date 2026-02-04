import { UserRole } from "@/types";
import ForbiddenScreen from "@/components/status/ForbiddenScreen";
import useMe from "@/hooks/api/useMe";
import { Outlet } from "react-router-dom";

export const StaffPage = () => {
  const { data: user } = useMe();

  if (user?.role != UserRole.STAFF) {
    return <ForbiddenScreen />;
  }

  return <Outlet />;
};

export const StudentPage = () => {
  const { data: user } = useMe();

  if (user?.role != UserRole.STUDENT) {
    return <ForbiddenScreen />;
  }

  return <Outlet />;
};
