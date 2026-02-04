import { FieldType } from "@/types";
import FieldCard from "./FieldCard";
import WeightIndicator from "./WeightIndicator";
import type { AssignmentFormReturn } from "@/types/hooks";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  form: AssignmentFormReturn;
}

export default function FieldsBuilderCard({ form }: Props) {
  const { state, actions } = form;

  return (
    <Card className="pt-10 border-t border-slate-100 shadow-none">
      <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8">
        <div>
          <h3 className="text-2xl font-black text-slate-900">
            מבנה שאלון הביקורת
          </h3>
          <p className="text-slate-500 font-medium">
            הגדר שאלות וקריטריונים לציון (ללא הגבלה לסקאלה מסוימת)
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            onClick={() => actions.addField(FieldType.SCALE, true)}
            className={cn(
              "bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer",
              "font-black text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-100",
            )}
          >
            + קריטריון ציון (סקאלה)
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={() => actions.addField(FieldType.TEXT, false)}
            className={cn(
              "font-black text-xs px-5 py-2.5 rounded-xl  cursor-pointer",
            )}
          >
            + פידבק טקסט
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {state.fields.map((f, i) => (
          <FieldCard key={f.id} index={i} field={f} form={form} />
        ))}

        <WeightIndicator total={state.totalWeight} fields={state.fields} />
      </CardContent>
    </Card>
  );
}
