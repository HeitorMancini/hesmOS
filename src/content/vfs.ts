import { VFS } from "./content";
import type { DocBlock, VfsKind, VfsNode } from "./types";

const byId = new Map(VFS.map((node) => [node.id, node]));

export const ROOT_ID = "root";

export function getNode(id: string | undefined | null): VfsNode | undefined {
  return id ? byId.get(id) : undefined;
}

export function getChildren(folderId: string | null): VfsNode[] {
  return VFS.filter((node) => node.parentId === folderId).sort((a, b) => {
    if (a.id === ROOT_ID || b.id === ROOT_ID) return a.id === ROOT_ID ? -1 : 1;
    if ((a.kind === "folder") !== (b.kind === "folder")) return a.kind === "folder" ? -1 : 1;
    return a.name.localeCompare(b.name, "pt-BR");
  });
}

export function getNodesByKind<K extends VfsKind>(kind: K): Extract<VfsNode, { kind: K }>[] {
  return VFS.filter((node): node is Extract<VfsNode, { kind: K }> => node.kind === kind);
}

export function getPath(id: string): string {
  const parts: string[] = [];
  let node = getNode(id);
  while (node) {
    parts.unshift(node.name);
    node = getNode(node.parentId);
  }
  if (parts.length === 1 && parts[0] === "C:") return "C:\\";
  return parts.join("\\");
}

export function resolvePath(fromFolderId: string, input: string): VfsNode | undefined {
  const raw = input.trim().replace(/\//g, "\\");
  if (!raw) return getNode(fromFolderId);

  let current = getNode(fromFolderId);
  let rest = raw;
  if (/^c:\\?/i.test(rest)) {
    current = getNode(ROOT_ID);
    rest = rest.replace(/^c:\\?/i, "");
  } else if (rest.startsWith("\\")) {
    current = getNode(ROOT_ID);
    rest = rest.slice(1);
  }

  for (const segment of rest.split("\\").filter(Boolean)) {
    if (!current) return undefined;
    if (segment === ".") continue;
    if (segment === "..") {
      current = getNode(current.parentId) ?? current;
      continue;
    }
    if (current.kind !== "folder") return undefined;
    const lower = segment.toLowerCase();
    current = getChildren(current.id).find((child) => child.name.toLowerCase() === lower);
  }
  return current;
}

const KIND_ICONS: Record<VfsKind, string> = {
  folder: "/icons/folder.svg",
  document: "/icons/doc.svg",
  video: "/icons/video-file.svg",
  audio: "/icons/audio-file.svg",
  link: "/icons/link.svg",
};

export function iconForNode(node: VfsNode): string {
  if (node.icon) return node.icon;
  if (node.id === ROOT_ID) return "/icons/drive.svg";
  if (node.kind === "document" && node.format === "txt") return "/icons/txt.svg";
  return KIND_ICONS[node.kind];
}

const KIND_LABELS: Record<VfsKind, string> = {
  folder: "Pasta de arquivos",
  document: "Documento do WordPad",
  video: "Clipe de vídeo",
  audio: "Som Wave",
  link: "Atalho da Internet",
};

export function kindLabel(node: VfsNode): string {
  if (node.kind === "document" && node.format === "txt") return "Documento de texto";
  return KIND_LABELS[node.kind];
}

function stripInline(text: string): string {
  return text.replace(/\*\*([^*]+)\*\*/g, "$1").replace(/\*([^*]+)\*/g, "$1");
}

export function docToPlainText(blocks: DocBlock[]): string {
  return blocks
    .map((block) => {
      switch (block.type) {
        case "heading":
          return block.level === 1 ? stripInline(block.text).toUpperCase() : stripInline(block.text);
        case "paragraph":
          return stripInline(block.text);
        case "image":
          return `[imagem: ${block.alt}]`;
        case "gallery":
          return block.images.map((image) => `[imagem: ${image.alt}]`).join("\n");
        case "quote":
          return `"${stripInline(block.text)}"${block.author ? `\n  - ${block.author}` : ""}`;
        case "list":
          return block.items
            .map((item, i) => `${block.ordered ? `${i + 1}.` : "-"} ${stripInline(item)}`)
            .join("\n");
        case "divider":
          return "----------------------------------------";
      }
    })
    .join("\n\n");
}
