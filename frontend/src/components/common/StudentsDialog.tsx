import { X } from "lucide-react";
import type { User } from "@/types";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface Props {
  open: boolean;
  title: string;
  subtitle: string;
  onClose: () => void;
  users: User[];
  studentIds?: string[];
}

const StudentsDialog = ({
  open,
  title,
  subtitle,
  onClose,
  users,
  studentIds,
}: Props) => {
  const getUserById = (id: string) => users.find((u) => u.id === id);

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="max-w-lg rounded-[2.5rem] p-0 overflow-hidden select-none"
      >
        <DialogHeader className="p-8 pb-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <DialogTitle className="text-xl font-black text-slate-900">
                {title}
              </DialogTitle>
              <p className="text-slate-500 text-xs text-start font-bold uppercase tracking-wider mt-1">
                {subtitle}
              </p>
            </div>

            <DialogClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </Button>
            </DialogClose>
          </div>
        </DialogHeader>

        <Separator />

        <div className="p-8">
          {studentIds?.length ? (
            <ScrollArea className="max-h-[60vh] pr-2">
              <div dir="rtl" className="space-y-3">
                {studentIds.map((id) => {
                  const s = getUserById(id);

                  return (
                    <div
                      key={id}
                      className={cn(
                        "flex items-center gap-4 p-4 rounded-2xl",
                        "bg-slate-50 border border-slate-100",
                      )}
                    >
                      <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black">
                        {(s?.name ?? "?").charAt(0)}
                      </div>

                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 truncate select-text">
                          {s?.name ?? "משתמש לא נמצא"}
                        </p>
                        <p className="text-xs text-slate-400 truncate select-text">
                          {s?.email ?? ""}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          ) : (
            <p className="text-center py-10 text-slate-400 font-bold italic">
              אין סטודנטים רשומים לקורס זה
            </p>
          )}
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-center">
          <Button
            onClick={onClose}
            className="rounded-xl bg-slate-900 hover:bg-slate-800 font-bold cursor-pointer"
          >
            סגור
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StudentsDialog;
