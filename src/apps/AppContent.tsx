"use client";

import { getApp } from "@/apps/registry";

type AppContentProps = {
  appId: string;
};

export function AppContent({ appId }: AppContentProps) {
  const app = getApp(appId);

  if (!app) {
    return <p>Programa não encontrado.</p>;
  }

  return (
    <div className="app-placeholder">
      <p>
        <strong>{app.title}</strong>
      </p>
      <p>
        Conteúdo de portfólio entra depois. Esta janela existe para exercitar o
        shell do hesmOS.
      </p>
    </div>
  );
}
