import type { Assignment, Course } from "@/types";

interface Props {
  assignment: Assignment;
  courses: Course[];
}

const SubmissionHeader = ({ assignment, courses }: Props) => {
  const deadlinePassed = new Date(assignment.deadline) < new Date();
  const courseName = courses.find((c) => c.id === assignment.courseId)?.name;

  return (
    <header className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
      <div className="flex items-center gap-3 mb-6">
        <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 text-[11px] font-black rounded-xl uppercase tracking-widest">
          {courseName}
        </span>
        <span
          className={`px-4 py-1.5 text-[11px] font-black rounded-xl uppercase tracking-widest ${deadlinePassed ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"}`}
        >
          {deadlinePassed ? "הגשה נסגרה" : "הגשה פתוחה"}
        </span>
      </div>
      <h1 className="text-4xl font-black text-slate-900 mb-4">
        {assignment.title}
      </h1>
      <p className="text-slate-600 text-lg leading-relaxed mb-8">
        {assignment.description}
      </p>
      <div className="inline-flex items-center gap-3 text-sm font-bold text-slate-400 bg-slate-50 p-4 rounded-2xl border border-slate-100">
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        דדליין: {new Date(assignment.deadline).toLocaleString("he-IL")}
      </div>
    </header>
  );
};

export default SubmissionHeader;
