import { FieldType, type Field } from "@/types";
import type { AssignmentFormReturn } from "@/types/hooks";
import { Trash } from "lucide-react";
import { cn } from "@/lib/utils";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Props {
  field: Field;
  index: number;
  form: AssignmentFormReturn;
}

export default function FieldCard({ field, index, form }: Props) {
  const { actions, state } = form;

  return (
    <Card
      draggable={state.fields.length > 1}
      onDragStart={() => actions.onDragStart(index)}
      onDragOver={(e) => actions.onDragOver(e, index)}
      onDragEnd={actions.onDragEnd}
      className={cn(
        "group p-6 bg-slate-50/50 rounded-3xl border-2 transition-all ",
        state.fields.length > 1 && "cursor-move",
        state.draggedIndex === index
          ? "opacity-30 scale-95 border-indigo-200"
          : "border-slate-100 hover:border-indigo-100",
      )}
    >
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Index */}
        <div className="w-10 h-10 bg-white rounded-xl border border-slate-200 flex items-center justify-center font-black text-slate-400 shrink-0 shadow-sm">
          {index + 1}
        </div>

        {/* Fields */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          {/* Name */}
          <div
            className="lg:col-span-2"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
              שם השדה
            </label>
            <Input
              value={field.name}
              onChange={(e) =>
                actions.updateField(field.id, { name: e.target.value })
              }
              placeholder="לדוגמה: איכות הקוד"
              className="font-bold text-sm bg-white border-slate-200"
            />
          </div>

          {/* Weight */}
          {field.required && (
            <div onMouseDown={(e) => e.stopPropagation()}>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                משקל (%)
              </label>
              <Input
                type="number"
                min={0}
                max={100}
                value={field.weight}
                onChange={(e) =>
                  actions.updateField(field.id, {
                    weight: Math.max(0, Math.min(Number(e.target.value), 100)),
                  })
                }
                className="font-bold text-sm bg-white border-slate-200"
              />
            </div>
          )}

          {/* Scale */}
          {field.type === FieldType.SCALE && (
            <div
              className="flex gap-2"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <div className="flex-1">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  מינימום
                </label>
                <Input
                  type="number"
                  value={field.scaleMin}
                  onChange={(e) =>
                    actions.updateField(field.id, {
                      scaleMin: Number(e.target.value),
                    })
                  }
                  className="text-center font-bold text-sm bg-white border-slate-200"
                />
              </div>

              <div className="flex-1">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  מקסימום
                </label>
                <Input
                  type="number"
                  value={field.scaleMax}
                  onChange={(e) =>
                    actions.updateField(field.id, {
                      scaleMax: Number(e.target.value),
                    })
                  }
                  className="text-center font-bold text-sm bg-white border-slate-200"
                />
              </div>
            </div>
          )}

          {/* Description */}
          <div
            className="md:col-span-2 lg:col-span-4"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
              הנחיות לסטודנט
            </label>
            <Input
              value={field.description}
              onChange={(e) =>
                actions.updateField(field.id, {
                  description: e.target.value,
                })
              }
              placeholder="מה המבקר צריך לבדוק?"
              className="text-sm font-medium bg-white border-slate-200"
            />
          </div>
        </div>

        {/* Delete */}
        <Button
          type="button"
          size="icon"
          variant="destructive"
          onClick={() => actions.removeField(field.id)}
          className="shrink-0 rounded-xl cursor-pointer"
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
