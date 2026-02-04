import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
  type RouteObject,
} from "react-router-dom";

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
        path: "users",
        lazy: () =>
          import("@/pages/UserManagementPage").then((module) => ({
            Component: module.default,
          })),
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
        <Toaster richColors position="top-left" />
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
