import { Outlet } from 'react-router';

export function MainLayout() {
  return (
    <div className="flex flex-col h-screen bg-black text-white">
      {/* 顶部导航栏 */}
      <header
      style={{
        backgroundImage: 'linear-gradient(rgba(31, 31, 31, 0.7), rgba(20, 20, 20, 0.7))',
        height: "64px",
      }}
      className="bg-black  px-4 py-2 flex justify-between items-center z-20">
        <div className="flex items-center space-x-4">
          <div className="font-bold text-white text-blue-500">3D 模型预览</div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
            <span className="text-xs">头像</span>
          </div>
        </div>
      </header>
      {/* 主要内容区域 */}
      <main className="flex flex-1 overflow-hidden">
        {/* 右侧内容区域 */}
        <section className="flex-1 p-4 overflow-y-auto">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
export default MainLayout;