import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  layout("./components/MainLayout.tsx", [
    index("./routes/home.tsx"),
    route("test1", "./routes/test1.tsx"),
  ]),
  layout("./components/BlankLayout.tsx", [
    route("blank", "./routes/blank.tsx"),
  ]),
] satisfies RouteConfig;
