import { Card } from "@/components/ui/card";
import type { Assignment, Group, Submission, User } from "@/types";

interface Props {
  sub: Submission;
  users: User[];
  groups: Group[];
  assignments: Assignment[];
  isStaff: boolean;
}

export default function SubmissionCard({
  sub,
  users,
  groups,
  assignments,
  isStaff,
}: Props) {
  const reviewer = users.find((u) => u.id === sub.studentId);
  const reviewedGroup = groups.find((g) => g.id === sub.reviewedGroupId);
  const assignment = assignments.find((a) => a.id === sub.assignmentId);

  return (
    <Card className="p-8 bg-slate-50/50 rounded-[2rem] border border-slate-100 hover:border-indigo-100 transition-all">
      <div className="flex justify-between mb-6 pb-6 border-b">
        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-slate-100">
          {isStaff ? "👤" : "💬"}
        </div>

        <div>
          <p className="font-black">
            {reviewer?.name} עבור {reviewedGroup?.name}
          </p>
          <p className="text-xs text-muted-foreground">
            {new Date(sub.submittedAt).toLocaleString("he-IL")}
          </p>
        </div>

        <div className="text-3xl font-black text-indigo-600">
          {sub.calculatedScore}%
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {sub.answers.map((ans) => {
          const field = assignment?.fields.find((f) => f.id === ans.fieldId);

          return (
            <div key={ans.fieldId} className="bg-white p-4 rounded-2xl border">
              <p className="text-xs font-black text-indigo-500 mb-2">
                {field?.name}
              </p>
              <p className="font-medium">{ans.value}</p>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
