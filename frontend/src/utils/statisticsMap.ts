import {
  BookOpen,
  ClipboardList,
  CheckCircle,
  Clock,
  Send,
  MessageSquare,
} from "lucide-react";

export const staffStatisticsMap = {
  coursesAmount: {
    label: "קורסים פעילים",
    description: "ניהול אקדמי שוטף",
    icon: BookOpen,
    color: "indigo",
  },
  openAssignmentsAmount: {
    label: "משימות פתוחות",
    description: "ביקורת עמיתים בתהליך",
    icon: ClipboardList,
    color: "amber",
  },
  submissionAmount: {
    label: "סה״כ ביקורות",
    description: "פידבק מצטבר מהסטודנטים",
    icon: CheckCircle,
    color: "emerald",
  },
};

export const studentStatisticsMap = {
  assignmentsToSubmitAmount: {
    label: "משימות להגשה",
    description: "מטלות פתוחות לביצוע",
    icon: Clock,
    color: "rose",
  },
  submissionsGivenAmount: {
    label: "ביקורות שנתתי",
    description: "התרומה שלך לקהילה",
    icon: Send,
    color: "indigo",
  },
  submissionsRecievedAmount: {
    label: "פידבק שהתקבל",
    description: "ביקורות על העבודה שלך",
    icon: MessageSquare,
    color: "sky",
  },
};
