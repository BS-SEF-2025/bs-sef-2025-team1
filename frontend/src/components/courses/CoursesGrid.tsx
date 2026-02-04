import CourseCard from "./CourseCard";
import type { Course } from "@/types";

const CoursesGrid = ({
  courses,
  onEdit,
  onView,
}: {
  courses: Course[];
  onEdit: (c: Course) => void;
  onView: (c: Course) => void;
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          course={course}
          onEdit={() => onEdit(course)}
          onView={() => onView(course)}
        />
      ))}
    </div>
  );
};

export default CoursesGrid;
