import { propEq } from "ramda";
import {
  deleteCollection,
  insertMany,
  testFirestore,
} from "../../../services/__tests__/firestore";
import { EntityNotFoundError } from "../../../utils/errors/client";
import { addTestPrefix } from "../../../utils/firestore.utils";
import { courseCollectionName, CourseDal } from "../dal";
import { courses } from "./mock";

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
      const courseToAdd = courses[0];
      const res = await courseDal.addCourse(courseToAdd!);

      expect(res).toEqual({
        id: expect.any(String),
        ...courseToAdd,
      });

      await deleteCollection(testCollectionName);
    });

    test("persists the course in the collection", async () => {
      const courseToAdd = courses[0];
      await courseDal.addCourse(courseToAdd!);
      const allCourses = await courseDal.getAllCourses();

      expect(allCourses).toContainEqual(expect.objectContaining(courseToAdd));

      await deleteCollection(testCollectionName);
    });
  });

  describe("renameCourse", () => {
    beforeEach(async () => {
      await insertMany(testCollectionName, courses);
    });

    afterEach(async () => {
      await deleteCollection(testCollectionName);
    });

    test("renames an existing course", async () => {
      const targetCourse = courses[0];
      const newName = "New Course Name";
      await courseDal.renameCourse(targetCourse!.id, newName);

      const updatedCourse = (await courseDal.getAllCourses()).find(propEq(newName, 'name'));
      
      expect(updatedCourse?.id).toBe(targetCourse?.id);
    });

    test("throws if course does not exist", async () => {
      await expect(
        courseDal.renameCourse("nonexistentId", "Whatever"),
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

      const deletedCourse = (await courseDal.getAllCourses()).find(propEq(targetCourse?.id, 'id'));
      
      expect(deletedCourse).toBeUndefined();
    });

    test("throws if course does not exist", async () => {
      await expect(
        courseDal.deleteCourse("nonexistentId"),
      ).rejects.toThrow(EntityNotFoundError);
    });
  });
});
