import { useQuery } from "@tanstack/react-query";
import * as courses from "@/api/courses";
import type { Course } from "@/types";

const useCourses = () => {
  return useQuery<Course[]>({
    queryKey: ["courses"],
    queryFn: courses.courses,
  });
};

export default useCourses;
