export type WindowMode = "normal" | "minimized" | "maximized";

export type Bounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type OsWindow = Bounds & {
  id: string;
  appId: string;
  title: string;
  icon: string;
  zIndex: number;
  mode: WindowMode;
  restoreBounds: Bounds;
};

export type AppDefinition = {
  id: string;
  title: string;
  icon: string;
  defaultSize: { width: number; height: number };
};
