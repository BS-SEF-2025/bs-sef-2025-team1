import { Card } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import type { Group } from "@/types";

interface Props {
  reviewedGroupId: string;
  setReviewedGroupId: (g: string) => void;
  reviewableGroups: Group[];
  myGroup: Group;
}

export default function GroupSelectorCard({
  reviewedGroupId,
  setReviewedGroupId,
  reviewableGroups,
  myGroup,
}: Props) {
  return (
    <Card className="p-10 rounded-[2.5rem]">
      <h2 className="text-2xl font-black mb-6">איזו קבוצה ברצונך לבקר?</h2>

      <Select
        value={reviewedGroupId}
        onValueChange={setReviewedGroupId}
        dir="rtl"
      >
        <SelectTrigger className="p-5 bg-slate-50 rounded-2xl font-bold w-full">
          <SelectValue placeholder="בחר קבוצה..." />
        </SelectTrigger>
        <SelectContent>
          {reviewableGroups.map((g) => (
            <SelectItem key={g.id} value={g.id}>
              {g.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {myGroup && (
        <p className="text-sm text-slate-400 italic">
          אינך יכול לבקר את הקבוצה שלך ({myGroup.name})
        </p>
      )}
    </Card>
  );
}
