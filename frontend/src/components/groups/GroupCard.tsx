import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Eye, Trash } from "lucide-react";
import ConfirmDeleteDialog from "@/components/common/ConfirmDeleteDialog";

import type { Group } from "@/types";

const GroupCard = ({
  group,
  courseName,
  onEdit,
  onView,
}: {
  group: Group;
  courseName: string;
  onEdit: () => void;
  onView: () => void;
}) => {
  return (
    <Card className="rounded-[2.5rem] border border-slate-100">
      <CardContent className="p-8 flex flex-col gap-6">
        <div className="flex justify-between">
          <div>
            <h3 className="text-xl font-black mt-2">{group.name}</h3>
            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 px-2 py-1 rounded-md">
              {courseName}
            </span>
          </div>

          <div className="flex gap-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={onEdit}
              className="cursor-pointer"
            >
              <Pencil className="w-4 h-4 text-amber-500" />
            </Button>

            <ConfirmDeleteDialog
              title="למחוק את הקבוצה?"
              description={`הקבוצה "${group.name}" תימחק לצמיתות.`}
              confirmText="מחק קבוצה"
              onConfirm={() => {}}
              trigger={
                <Button size="icon" variant="ghost" className="cursor-pointer">
                  <Trash className="w-4 h-4 text-rose-500" />
                </Button>
              }
            />
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-slate-400">חברים</p>
            <p className="text-lg font-black">{group.members.length}</p>
          </div>

          <Button
            variant="outline"
            onClick={onView}
            className="rounded-xl text-indigo-600 hover:text-indigo-600/75 bg-indigo-50/50 hover:bg-indigo-50 transition-all cursor-pointer"
          >
            <Eye className="w-4 h-4 mr-2" />
            צפייה בחברים
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GroupCard;
