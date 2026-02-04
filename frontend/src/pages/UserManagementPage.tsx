import { useState, useMemo } from "react";

import UsersHeader from "@/components/usermanagement/UsersHeader";
import UsersTable from "@/components/usermanagement/UsersTable";
import useMe from "@/hooks/api/useMe";
import useUsers from "@/hooks/api/users/useUsers";
import LoadingScreen from "@/components/status/LoadingScreen";
import ErrorScreen from "@/components/status/ErrorScreen";
import { HttpStatusCode, isAxiosError } from "axios";
import ForbiddenScreen from "@/components/status/ForbiddenScreen";
import UnauthorizedScreen from "@/components/status/UnauthorizedScreen";

const UserManagementPage = () => {
  const [search, setSearch] = useState("");

  const { data: user } = useMe();
  const { data: users, isLoading, isError, error } = useUsers();

  const filteredUsers = useMemo(() => {
    return (users || []).filter(
      (u) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, users]);

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

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <UsersHeader search={search} setSearch={setSearch} />
      <UsersTable users={filteredUsers} currentUserId={user?.id || ""} />
    </div>
  );
};

export default UserManagementPage;
