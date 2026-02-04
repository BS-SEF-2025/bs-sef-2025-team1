import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clipboard, Pencil, Trash, Clock, FileText } from "lucide-react";

import ConfirmDeleteDialog from "@/components/common/ConfirmDeleteDialog";
import type { Assignment } from "@/types";
import useAssignmentMutations from "@/hooks/api/assignments/useAssignmentMutations";
import { toast } from "sonner";

const AssignmentCard = ({
  assignment,
  courseName,
}: {
  assignment: Assignment;
  courseName: string;
}) => {
  const navigate = useNavigate();

  const { deleteAssignment } = useAssignmentMutations();

  const isExpired = new Date(assignment.deadline) < new Date();

  const copyLink = async () => {
    const url = `${window.location.origin}/direct-submit/${assignment.id}`;
    await navigator.clipboard.writeText(url);
    toast.info("הקישור הועתק בהצלחה!");
  };

  return (
    <Card className="rounded-[2.5rem] border border-slate-100">
      <CardContent className="p-8 flex flex-col lg:flex-row justify-between gap-8">
        {/* Left */}
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-lg uppercase tracking-widest">
              {courseName}
            </span>
            <span
              className={`px-3 py-1 text-[10px] font-black rounded-lg uppercase tracking-widest ${isExpired ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"}`}
            >
              {isExpired ? "הסתיימה" : "פעילה"}
            </span>
          </div>

          <h3 className="text-2xl font-black text-slate-900">
            {assignment.title}
          </h3>

          <p className="text-slate-500 line-clamp-2">
            {assignment.description}
          </p>

          <div className="flex items-center gap-6 text-sm font-bold text-slate-500">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />

              <bdi>{assignment.deadline.toLocaleString("he-IL")}</bdi>
            </div>

            <div className="flex items-center gap-2 text-indigo-500">
              <FileText className="w-4 h-4" />
              {assignment.fields.length} שדות
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="gap-2 cursor-pointer"
            onClick={copyLink}
          >
            <Clipboard className="w-4 h-4" />
            העתק קישור
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer"
            onClick={() => navigate(`/assignments/edit/${assignment.id}`)}
          >
            <Pencil className="w-5 h-5 text-amber-500" />
          </Button>

          <ConfirmDeleteDialog
            title="למחוק את המשימה?"
            description={`פעולה זו תמחק את "${assignment.title}" לצמיתות.`}
            confirmText="מחק משימה"
            onConfirm={() => deleteAssignment(assignment.id)}
            trigger={
              <Button variant="ghost" size="icon" className="cursor-pointer">
                <Trash className="w-5 h-5 text-rose-500" />
              </Button>
            }
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default AssignmentCard;
