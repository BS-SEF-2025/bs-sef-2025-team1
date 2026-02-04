import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AssignmentDal } from "../../entities/Assignment/dal.js";
import { CourseDal } from "../../entities/Course/dal.js";
import { SubmissionDal } from "../../entities/Submission/dal.js";
import { GroupDal } from "../../entities/Group/dal.js";
import { User } from "../../entities/User/schema.js";
import { AuthenticatedRequest } from "../auth/middleware.js";
import { StaffStatisticsSchema, StudentStatisticsSchema } from "./schema.js";

export const getStatisticsHandler =
  (
    assignmentsDal: AssignmentDal,
    coursesDal: CourseDal,
    submissionsDal: SubmissionDal,
    groupsDal: GroupDal,
  ) =>
  async (req: Request, res: Response) => {
    try {
      const user = (req as AuthenticatedRequest).user;

      if (user.role === "STAFF") {
        const staffStats = await getStatisticsForStaff(
          coursesDal,
          assignmentsDal,
          submissionsDal,
        );

        res.status(StatusCodes.OK).json({
          success: true,
          data: staffStats,
        });
        return;
      }

      const studentStats = await getStatisticsForStudent(
        user,
        coursesDal,
        assignmentsDal,
        submissionsDal,
        groupsDal,
      );

      res.status(StatusCodes.OK).json({
        success: true,
        data: studentStats,
      });
    } catch (error: any) {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        error: error.message,
      });
    }
  };

const getStatisticsForStaff = async (
  coursesDal: CourseDal,
  assignmentsDal: AssignmentDal,
  submissionsDal: SubmissionDal,
) => {
  const [courses, assignments, submissionד] = await Promise.all([
    coursesDal.getAllCourses(),
    assignmentsDal.getAllAssignments(),
    submissionsDal.getAllSubmissions(),
  ]);

  return StaffStatisticsSchema.parse({
    coursesAmount: courses.length,
    openAssignmentsAmount: assignments.filter(
      (a) => new Date(a.deadline) > new Date(),
    ).length,
    submissionAmount: submissionד.length,
  });
};

const getStatisticsForStudent = async (
  user: User,
  coursesDal: CourseDal,
  assignmentsDal: AssignmentDal,
  submissionsDal: SubmissionDal,
  groupsDal: GroupDal,
) => {
  const [studentCourses, assignments, submissions, groups] = await Promise.all([
    coursesDal.getCoursesByEnrolledStudent(user.id),
    assignmentsDal.getAllAssignments(),
    submissionsDal.getAllSubmissions(),
    groupsDal.getAllGroups(),
  ]);

  return StudentStatisticsSchema.parse({
    assignmentsToSubmitAmount: assignments.filter(
      (a) =>
        studentCourses.some((c) => c.id === a.courseId) &&
        new Date(a.deadline) > new Date(),
    ).length,
    submissionsGivenAmount: submissions.filter((s) => s.studentId === user.id)
      .length,
    submissionsRecievedAmount: submissions.filter((s) => {
      const assignment = assignments.find((a) => a.id === s.assignmentId);
      const myGroup = groups.find(
        (g) =>
          g.members.includes(user.id) && g.courseId === assignment?.courseId,
      );
      return s.reviewedGroupId === myGroup?.id;
    }).length,
  });
};
