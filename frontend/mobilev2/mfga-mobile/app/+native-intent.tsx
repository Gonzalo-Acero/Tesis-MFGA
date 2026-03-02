const LEGACY_ROUTE_MAP: Record<string, string> = {
  '/(tabs)/index': '/(tabs)',
  '/(tabs)/(home)': '/(tabs)',
  '/(tabs)/(home)/index': '/(tabs)',
  '/(home)': '/(tabs)',
  '/(home)/index': '/(tabs)',
  '/discover/index': '/(tabs)/discover',
  '/guides/index': '/(tabs)/guides',
  '/nearby/index': '/(tabs)/nearby',
  '/community/index': '/(tabs)/community',
};

function normalizePath(path: string) {
  const [pathname, query = ""] = path.split("?");
  const cleanPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const mappedPath = LEGACY_ROUTE_MAP[cleanPath] ?? cleanPath;

  if (mappedPath === "/" || mappedPath === "") {
    return "/";
  }

  return query ? `${mappedPath}?${query}` : mappedPath;
}

export function redirectSystemPath({
  path,
}: {
  path: string;
  initial: boolean;
}) {
  return normalizePath(path);
}
