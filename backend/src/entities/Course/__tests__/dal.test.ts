import { propEq } from "ramda";
import {
  deleteCollection,
  insertMany,
  testFirestore,
} from "../../../services/__tests__/firebase.js";
import { EntityNotFoundError } from "../../../utils/errors/client.js";
import { addTestPrefix } from "../../../utils/firestore.utils.js";
import { courseCollectionName, CourseDal } from "../dal.js";
import { courses } from "./mock.js";

describe("course dal", () => {
  const testCollectionName = addTestPrefix(courseCollectionName);
  const courseDal = new CourseDal(testFirestore, testCollectionName);

  describe("getAllCourses", () => {
    test("empty collection", async () => {
      const res = await courseDal.getAllCourses();

      expect(res).toEqual([]);
    });

    test("non empty collection", async () => {
      await insertMany(testCollectionName, courses);
      const res = await courseDal.getAllCourses();

      await deleteCollection(testCollectionName);

      expect(res).toEqual(courses);
    });
  });

  describe("addCourse", () => {
    test("adds a course and returns it with an id", async () => {
      const courseData = {
        name: "Test Course",
        enrolledStudents: ["student1"],
      };
      const res = await courseDal.addCourse(courseData, "staff1");

      expect(res).toEqual({
        id: expect.any(String),
        name: "Test Course",
        enrolledStudents: ["student1"],
        createdBy: "staff1",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });

      await deleteCollection(testCollectionName);
    });

    test("persists the course in the collection", async () => {
      const courseData = {
        name: "Test Course",
        enrolledStudents: ["student1"],
      };
      await courseDal.addCourse(courseData, "staff1");
      const allCourses = await courseDal.getAllCourses();

      expect(allCourses).toHaveLength(1);
      expect(allCourses[0]).toMatchObject({
        name: "Test Course",
        enrolledStudents: ["student1"],
        createdBy: "staff1",
      });

      await deleteCollection(testCollectionName);
    });
  });

  describe("updateCourse", () => {
    beforeEach(async () => {
      await insertMany(testCollectionName, courses);
    });

    afterEach(async () => {
      await deleteCollection(testCollectionName);
    });

    test("updates an existing course", async () => {
      const targetCourse = courses[0];
      const newName = "New Course Name";
      await courseDal.updateCourse(targetCourse!.id, { name: newName });

      const updatedCourse = (await courseDal.getAllCourses()).find(
        (c) => c.name === newName,
      );

      expect(updatedCourse?.id).toBe(targetCourse?.id);
    });

    test("throws if course does not exist", async () => {
      await expect(
        courseDal.updateCourse("nonexistentId", { name: "Whatever" }),
      ).rejects.toThrow(EntityNotFoundError);
    });
  });

  describe("deleteCourse", () => {
    beforeEach(async () => {
      await insertMany(testCollectionName, courses);
    });

    afterEach(async () => {
      await deleteCollection(testCollectionName);
    });

    test("deletes an existing course", async () => {
      const targetCourse = courses[0];

      await courseDal.deleteCourse(targetCourse!.id);

      const deletedCourse = (await courseDal.getAllCourses()).find(
        propEq(targetCourse?.id, "id"),
      );

      expect(deletedCourse).toBeUndefined();
    });

    test("throws if course does not exist", async () => {
      await expect(courseDal.deleteCourse("nonexistentId")).rejects.toThrow(
        EntityNotFoundError,
      );
    });
  });
});
