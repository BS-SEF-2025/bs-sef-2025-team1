import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatisticCard from "@/components/dashboard/StatisticCard";
import {
  staffStatisticsMap,
  studentStatisticsMap,
} from "@/utils/statisticsMap";
import useMe from "@/hooks/api/useMe";
import DashboardCta from "@/components/dashboard/DashboardCta";
import useStatistics from "@/hooks/api/useStatistics";
import { HttpStatusCode, isAxiosError } from "axios";
import UnauthorizedScreen from "@/components/status/UnauthorizedScreen";
import ForbiddenScreen from "@/components/status/ForbiddenScreen";
import ErrorScreen from "@/components/status/ErrorScreen";
import LoadingScreen from "@/components/status/LoadingScreen";

const Dashboard = () => {
  const { data: user } = useMe();

  const { data: statistics, isLoading, isError, error } = useStatistics();

  if (!user) return null;

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

  const isStaff = user.role === "STAFF";
  const map = isStaff ? staffStatisticsMap : studentStatisticsMap;

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <DashboardHeader name={user.name} role={user.role} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {Object.entries(map).map(([key, meta]) => {
          const value = statistics?.[key as keyof typeof statistics] ?? 0;

          return (
            <StatisticCard
              key={key}
              label={meta.label}
              description={meta.description}
              value={value}
              Icon={meta.icon}
              color={meta.color}
            />
          );
        })}
      </div>

      <DashboardCta />
    </div>
  );
};

export default Dashboard;
