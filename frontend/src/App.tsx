import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
  type RouteObject,
} from "react-router-dom";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { Toaster } from "@/components/ui/sonner";

import { AuthProvider } from "@/providers/AuthProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const routes: RouteObject[] = [
  {
    path: "/login",
    lazy: () =>
      import("@/pages/LoginPage").then((module) => ({
        Component: module.default,
      })),
  },
  {
    path: "/direct-submit/:assignment",
    lazy: () =>
      import("@/pages/DirectSubmitPage").then((module) => ({
        Component: module.default,
      })),
  },
  {
    path: "/",
    lazy: () =>
      import("@/layouts/AppLayout").then((module) => ({
        Component: module.default,
      })),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: "dashboard",
        lazy: () =>
          import("@/pages/DashboardPage").then((module) => ({
            Component: module.default,
          })),
      },
      {
        path: "courses",
        lazy: () =>
          import("@/pages/CourseManagementPage").then((module) => ({
            Component: module.default,
          })),
      },
      {
        path: "groups",
        lazy: () =>
          import("@/pages/GroupManagementPage").then((module) => ({
            Component: module.default,
          })),
      },
      {
        path: "users",
        lazy: () =>
          import("@/pages/UserManagementPage").then((module) => ({
            Component: module.default,
          })),
      },
      {
        path: "results",
        lazy: () =>
          import("@/pages/ResultsPage").then((module) => ({
            Component: module.default,
          })),
      },
      {
        path: "assignments",
        lazy: () =>
          import("@/pages/ProtectedPages").then((module) => ({
            Component: module.StaffPage,
          })),
        children: [
          {
            index: true,
            lazy: () =>
              import("@/pages/Assignments/AssignmentManagementPage").then(
                (module) => ({
                  Component: module.default,
                }),
              ),
          },
          {
            path: "create",
            lazy: () =>
              import("@/pages/Assignments/AssignmentCreatePage").then(
                (module) => ({
                  Component: module.default,
                }),
              ),
          },
          {
            path: "edit/:assignment",
            lazy: () =>
              import("@/pages/Assignments/AssignmentEditPage").then(
                (module) => ({
                  Component: module.default,
                }),
              ),
          },
          {
            path: "*",
            element: <Navigate to="/assignments" replace />,
          },
        ],
      },
      {
        path: "submit",
        lazy: () =>
          import("@/pages/ProtectedPages").then((module) => ({
            Component: module.StudentPage,
          })),
        children: [
          {
            index: true,
            lazy: () =>
              import("@/pages/Submit/StudentSubmitListPage").then((module) => ({
                Component: module.default,
              })),
          },
          {
            path: ":assignment",
            lazy: () =>
              import("@/pages/Submit/SubmissionPage").then((module) => ({
                Component: module.default,
              })),
          },
          {
            path: "*",
            element: <Navigate to="/submit" replace />,
          },
        ],
      },
      {
        path: "*",
        element: <div>עמוד לא נמצא</div>,
      },
    ],
  },
];

const queryClient = new QueryClient();

const App = () => {
  const router = createBrowserRouter(routes);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />

        {import.meta.env.DEV && (
          <ReactQueryDevtools
            initialIsOpen={false}
            buttonPosition="bottom-left"
          />
        )}

        <Toaster richColors position="top-left" />
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
