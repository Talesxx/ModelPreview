import type { Route } from "./+types/test1";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "测试页面1" },
  ];
}

export default function Test1() {
  return (
    <div className="text-center py-10">
      这是MainLayout下的测试页面1
    </div>
  );
}