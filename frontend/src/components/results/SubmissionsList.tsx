import SubmissionCard from "./SubmissionCard";
import { Card } from "@/components/ui/card";
import type { Assignment, Group, Submission, User } from "@/types";

export default function SubmissionsList({
  submissions,
  users,
  groups,
  assignments,
  isStaff,
}: {
  submissions: Submission[];
  users: User[];
  groups: Group[];
  assignments: Assignment[];
  isStaff: boolean;
}) {
  return (
    <section className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-8 border-b border-slate-50">
        <h3 className="font-black text-xl text-slate-900">
          {isStaff ? "פירוט כל הביקורות" : "פידבקים שהתקבלו עבורנו"}
        </h3>
      </div>

      {submissions.length === 0 ? (
        <Card className="m-8 py-20 flex flex-col items-center border-none shadow-none">
          <div className="text-6xl mb-4 grayscale opacity-50">🏜️</div>
          <p className="text-xl font-bold text-slate-400">
            לא נמצאו ביקורות להצגה
          </p>
        </Card>
      ) : (
        <div className="p-8 space-y-6">
          {submissions.map((sub) => (
            <SubmissionCard
              key={sub.id}
              sub={sub}
              users={users}
              groups={groups}
              assignments={assignments}
              isStaff={isStaff}
            />
          ))}
        </div>
      )}
    </section>
  );
}
