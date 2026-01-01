import { create } from 'zustand';

export interface ModelPreviewState {
  isOpen: boolean;
  modelUrl: string | undefined;
  width: number;
  height: number;
}

export interface ModelPreviewActions {
  openPreview: (modelUrl?: string, width?: number, height?: number) => void;
  closePreview: () => void;
  setModelUrl: (url: string | undefined) => void;
}

export type ModelPreviewStore = ModelPreviewState & ModelPreviewActions;

export const useModelPreviewStore = create<ModelPreviewStore>((set) => ({
  // 初始状态
  isOpen: false,
  modelUrl: undefined,
  width: 800,
  height: 600,

  // 打开预览
  openPreview: (modelUrl, width = 800, height = 600) => {
    set({
      isOpen: true,
      modelUrl,
      width,
      height,
    });
  },

  // 关闭预览
  closePreview: () => {
    set({ isOpen: false });
  },

  // 设置模型URL
  setModelUrl: (url) => {
    set({ modelUrl: url });
  },
}));
