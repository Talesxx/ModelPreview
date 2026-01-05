import { create } from 'zustand';

export interface ModelPreviewState {
  isOpen: boolean;
  modelUrl: string | undefined;
  width: number;
  height: number;
  isLoading: boolean;
  loadingProgress: number;
}

export interface ModelPreviewActions {
  openPreview: (modelUrl?: string, width?: number, height?: number) => void;
  closePreview: () => void;
  setModelUrl: (url: string | undefined) => void;
  setLoadingProgress: (progress: number) => void;
  setIsLoading: (loading: boolean) => void;
}

export type ModelPreviewStore = ModelPreviewState & ModelPreviewActions;

export const useModelPreviewStore = create<ModelPreviewStore>((set) => ({
  // 初始状态
  isOpen: false,
  modelUrl: undefined,
  width: 800,
  height: 600,
  isLoading: false,
  loadingProgress: 0,

  // 打开预览
  openPreview: (modelUrl, width = 800, height = 600) => {
    set({
      isOpen: true,
      modelUrl,
      width,
      height,
      isLoading: !!modelUrl,
      loadingProgress: 0,
    });
  },

  // 关闭预览
  closePreview: () => {
    set({ isOpen: false, isLoading: false, loadingProgress: 0 });
  },

  // 设置模型URL
  setModelUrl: (url) => {
    set({ modelUrl: url, isLoading: !!url, loadingProgress: 0 });
  },

  // 设置加载进度
  setLoadingProgress: (progress) => {
    set({ loadingProgress: progress });
  },

  // 设置加载状态
  setIsLoading: (loading) => {
    set({ isLoading: loading });
  },
}));
