import type { Route } from "./+types/home";
import { Link } from "react-router";
import { useState } from "react";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "model preview" },
    { name: "description", content: "Preview 3D models in the browser" },
  ];
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<'local' | 'network'>('local');

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
        className="w-88  rounded-xl shadow-xl p-4 z-10">
        <div className="space-y-6">
          {/* Tab切换 */}
          <div className="flex gap-2 p-1 bg-black/30 rounded-lg">
            <button
              onClick={() => setActiveTab('local')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                activeTab === 'local'
                  ? 'bg-gray-700 text-white shadow-md'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              本地文件
            </button>
            <button
              onClick={() => setActiveTab('network')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                activeTab === 'network'
                  ? 'bg-gray-700 text-white shadow-md'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              网络连接
            </button>
          </div>

          {/* 文件上传区域 */}
          {activeTab === 'local' ? (
            <div>
              <label 
                htmlFor="file-upload" 
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 transition-colors bg-black/20 hover:bg-black/30"
              >
                <div className="flex flex-col items-center justify-center p-2">
                  <svg className="w-10 h-10 mb-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.413V13H5.5z"/>
                  </svg>
                  <p className="mb-2 text-sm text-gray-300">
                    <span className="font-medium text-blue-400">选择模型文件</span>
                  </p>
                  <p className="text-xs text-gray-500">支持glTF、OBJ、FBX、3DM、3DS、STL、PLY等格式</p>
                </div>
                <input 
                  id="file-upload" 
                  type="file" 
                  className="hidden" 
                  accept=".gltf,.obj,.fbx,.3dm,.3ds,.stl,.ply"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      console.log('选择的文件:', file.name);
                      // 这里可以添加文件处理逻辑
                    }
                  }}
                />
              </label>
            </div>
          ) : (
            <div>
              <input
                type="text"
                placeholder="请输入模型文件URL"
                className="w-full px-4 py-3 bg-black/20 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                onChange={(e) => {
                  console.log('输入的URL:', e.target.value);
                  // 这里可以添加URL处理逻辑
                }}
              />
            </div>
          )}

          <div>
            <button className="w-full bg-blue-500 hover:bg-blue-600 py-3 rounded-md text-base font-medium transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-blue-500/25">
              预览模型
            </button>
          </div>
        </div>
      </aside>

      <div className="mt-4 text-center">
 
      </div>
    </div>
  );
}
