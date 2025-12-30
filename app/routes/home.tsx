import type { Route } from "./+types/home";
import { Link } from "react-router";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "model preview" },
    { name: "description", content: "Preview 3D models in the browser" },
  ];
}

export default function Home() {
  return (
    <div>
      <aside
        style={{
          marginLeft: "12px",
          marginTop: "12px",
          background: 'linear-gradient(173.53deg, rgba(43, 43, 43, 0.9) 1.1%, rgba(23, 23, 23, 0.9) 83.51%)',
          flex: "0 0 auto",
          alignSelf: "flex-start",
        }}
        className="w-64  rounded-xl shadow-xl p-4 z-10">
        <div className="space-y-6">
          <div>
            <button className="w-full bg-blue-500 hover:bg-blue-600 py-3 rounded-md text-base font-medium transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-blue-500/25">
              预览模型
            </button>
          </div>
        </div>
      </aside>

      <div className="mt-4 text-center">
        <Link to="/blank" className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded mt-4 inline-block">
          查看空白布局页面
        </Link>
      </div>
    </div>
  );
}
