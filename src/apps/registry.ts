import type { AppDefinition } from "@/os/types";

export const APPS: AppDefinition[] = [
  {
    id: "my-computer",
    title: "Meu Computador",
    icon: "/icons/computer.svg",
    defaultSize: { width: 420, height: 280 },
  },
  {
    id: "recycle-bin",
    title: "Lixeira",
    icon: "/icons/recycle.svg",
    defaultSize: { width: 380, height: 260 },
  },
  {
    id: "about",
    title: "Sobre",
    icon: "/icons/about.svg",
    defaultSize: { width: 400, height: 260 },
  },
  {
    id: "projects",
    title: "Projetos",
    icon: "/icons/folder.svg",
    defaultSize: { width: 440, height: 300 },
  },
];

export function getApp(appId: string): AppDefinition | undefined {
  return APPS.find((app) => app.id === appId);
}
