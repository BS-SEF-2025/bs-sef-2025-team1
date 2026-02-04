import GroupCard from "./GroupCard";
import type { Group, Course } from "@/types";

const GroupsGrid = ({
  groups,
  courses,
  onEdit,
  onView,
}: {
  groups: Group[];
  courses: Course[];
  onEdit: (g: Group) => void;
  onView: (g: Group) => void;
}) => {
  const getCourseName = (id: string) =>
    courses.find((c) => c.id === id)?.name ?? "";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {groups.map((g) => (
        <GroupCard
          key={g.id}
          group={g}
          courseName={getCourseName(g.courseId)}
          onEdit={() => onEdit(g)}
          onView={() => onView(g)}
        />
      ))}
    </div>
  );
};

export default GroupsGrid;
