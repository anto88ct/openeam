/** Maps an icon name to its imported SVG asset (see src/assets/icons). */
const files = import.meta.glob<{ default: ImageMetadata }>('../assets/icons/*.svg', {
  eager: true,
});

const map: Record<string, ImageMetadata> = {};
for (const path in files) {
  const name = path.split('/').pop()!.replace('.svg', '');
  map[name] = files[path].default;
}

export function getIcon(name: string): ImageMetadata | undefined {
  return map[name] ?? map['gear'];
}
