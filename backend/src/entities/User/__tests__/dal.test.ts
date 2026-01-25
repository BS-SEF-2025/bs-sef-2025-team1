import { prop, propEq, sortBy } from "ramda";
import {
    deleteCollection,
    insertMany,
    testFirestore,
} from "../../../services/__tests__/firestore";
import { EntityNotFoundError } from "../../../utils/errors/client";
import { addTestPrefix } from "../../../utils/firestore.utils";
import { UserDal, usersCollectionName } from "../dal";
import { users } from "./mock";

describe("user dal", () => {
  const testCollectionName = addTestPrefix(usersCollectionName);
  const userDal = new UserDal(testFirestore, testCollectionName);

  describe("getAllUsers", () => {
    test("empty collection", async () => {
      const res = await userDal.getAllUsers();

      expect(res).toEqual([]);
    });

    test("non empty collection", async () => {
      await insertMany(testCollectionName, users);
      const res = await userDal.getAllUsers();

      await deleteCollection(testCollectionName);
      const sorter = sortBy(prop('id'));
      expect(sorter(res)).toEqual(sorter(users));
    });
  });

  describe("addUser", () => {
    test("adds a user and returns it", async () => {
      const userToAdd = {
        name: "Jane Smith",
        email: "jane.smith@example.com",
        password: "hashedpassword",
        role: "staff" as const,
      };
      const res = await userDal.addUser(userToAdd);

      expect(res).toMatchObject({
        name: userToAdd.name,
        email: userToAdd.email,
        password: userToAdd.password,
        role: userToAdd.role,
      });
      expect(res.id).toBeDefined();
      expect(res.createdAt).toBeInstanceOf(Date);
      expect(res.updatedAt).toBeInstanceOf(Date);

      await deleteCollection(testCollectionName);
    });

    test("persists the user in the collection", async () => {
      const userToAdd = {
        name: "Jane Smith",
        email: "jane.smith@example.com",
        password: "hashedpassword",
        role: "staff" as const,
      };
      const addedUser = await userDal.addUser(userToAdd);
      const allUsers = await userDal.getAllUsers();

      expect(allUsers).toContainEqual(addedUser);

      await deleteCollection(testCollectionName);
    });
  });

  describe("getUserById", () => {
    beforeEach(async () => {
      await insertMany(testCollectionName, users);
    });

    afterEach(async () => {
      await deleteCollection(testCollectionName);
    });

    test("returns the user if exists", async () => {
      const targetUser = users[0];
      const res = await userDal.getUserById(targetUser!.id);

      expect(res).toEqual(targetUser);
    });

    test("throws if user does not exist", async () => {
      await expect(
        userDal.getUserById("nonexistentId"),
      ).rejects.toThrow(EntityNotFoundError);
    });
  });

  describe("updateUser", () => {
    beforeEach(async () => {
      await insertMany(testCollectionName, users);
    });

    afterEach(async () => {
      await deleteCollection(testCollectionName);
    });

    test("updates an existing user", async () => {
      const targetUser = users[0];
      const updates = { name: "Updated Name" };
      await userDal.updateUser(targetUser!.id, updates);

      const updatedUser = await userDal.getUserById(targetUser!.id);

      expect(updatedUser.name).toBe("Updated Name");
    });

    test("throws if user does not exist", async () => {
      await expect(
        userDal.updateUser("nonexistentId", { name: "Whatever" }),
      ).rejects.toThrow(EntityNotFoundError);
    });
  });

  describe("deleteUser", () => {
    beforeEach(async () => {
      await insertMany(testCollectionName, users);
    });

    afterEach(async () => {
      await deleteCollection(testCollectionName);
    });

    test("deletes an existing user", async () => {
      const targetUser = users[0];

      await userDal.deleteUser(targetUser!.id);

      const deletedUser = (await userDal.getAllUsers()).find(propEq(targetUser?.id, 'id'));

      expect(deletedUser).toBeUndefined();
    });

    test("throws if user does not exist", async () => {
      await expect(
        userDal.deleteUser("nonexistentId"),
      ).rejects.toThrow(EntityNotFoundError);
    });
  });
});