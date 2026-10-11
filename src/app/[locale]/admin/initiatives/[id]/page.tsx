import {InitiativesExplorer, type Initiative} from '@/components/initiatives/InitiativesExplorer';

const API = process.env.NEXT_PUBLIC_API_URL;

async function getInitiatives(): Promise<Initiative[]> {
  const res = await fetch(`${API}/public/initiatives`, {cache: 'no-store'});
  if (!res.ok) return [];
  return res.json();
}

async function getCovers(): Promise<Record<string, string>> {
  try {
    const res = await fetch(`${API}/public/initiative-covers`, {cache: 'no-store'});
    if (!res.ok) return {};
    const covers = (await res.json()) as {slug: string; imageId: string}[];
    return Object.fromEntries(
      covers.map((c) => [c.slug, `${API}/public/images/${c.imageId}`])
    );
  } catch {
    return {};
  }
}

export default async function InitiativesListPage({
  searchParams
}: {
  params: Promise<{locale: string}>;
  searchParams: Promise<{initiative?: string}>;
}) {
  const {initiative} = await searchParams;
  const [list, covers] = await Promise.all([getInitiatives(), getCovers()]);

  const initiatives = list.map((i) => ({
    ...i,
    imageUrl: covers[i.slug] ?? i.imageUrl ?? null
  }));

  const initialSlug =
    initiatives.find((i) => i.slug === initiative)?.slug ?? initiatives[0]?.slug ?? null;

  return <InitiativesExplorer initiatives={initiatives} initialSlug={initialSlug} />;
}