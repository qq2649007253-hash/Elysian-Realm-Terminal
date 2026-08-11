import { NextResponse } from 'next/server';

const RESOURCE_BASE_URL = 'https://cdn.jsdelivr.net/gh/Mar-7th/StarRailRes@master/';
const CHARACTER_INDEX_URL = `${RESOURCE_BASE_URL}index_new/cn/characters.json`;

export const revalidate = 60 * 60 * 12;

interface ResourceCharacter {
  element: string;
  icon: string;
  id: string;
  name: string;
  path: string;
  portrait: string;
  rarity: number;
}

/**
 * 星穹铁道角色索引由 StarRailRes 维护；服务端转发可避免浏览器跨域问题，
 * 同时利用 Next 的缓存让角色库在资源更新后自动同步。
 */
export const GET = async () => {
  try {
    const response = await fetch(CHARACTER_INDEX_URL, {
      next: { revalidate },
    });

    if (!response.ok) throw new Error(`Character index request failed: ${response.status}`);

    const characters = (await response.json()) as Record<string, ResourceCharacter>;
    const items = Object.values(characters)
      .filter((character) => character.name && character.name !== '{NICKNAME}')
      .map((character) => ({
        ...character,
        icon: `${RESOURCE_BASE_URL}${character.icon}`,
        portrait: `${RESOURCE_BASE_URL}${character.portrait}`,
      }))
      .sort((a, b) => Number(a.id) - Number(b.id));

    return NextResponse.json({ items, source: 'StarRailRes' });
  } catch (error) {
    console.error('Failed to load Star Rail character index:', error);
    return NextResponse.json({ items: [], source: 'StarRailRes' }, { status: 502 });
  }
};
