'use client';

import { Button, Empty, Input, Segmented, Spin } from 'antd';
import { createStyles } from 'antd-style';
import { Search, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { memo, useMemo, useState } from 'react';
import { Flexbox } from 'react-layout-kit';
import useSWR from 'swr';

import { DEFAULT_LLM_CONFIG } from '@/constants/agent';
import { useAgentStore } from '@/store/agent';
import { useSessionStore } from '@/store/session';
import { Agent, GenderEnum, RoleCategoryEnum } from '@/types/agent';

const PATH_LABELS: Record<string, string> = {
  Elation: '欢愉',
  Knight: '存护',
  Mage: '智识',
  Memory: '记忆',
  Priest: '丰饶',
  Rogue: '巡猎',
  Shaman: '同谐',
  Warlock: '虚无',
  Warrior: '毁灭',
};

const ELEMENT_LABELS: Record<string, string> = {
  Fire: '火',
  Ice: '冰',
  Imaginary: '虚数',
  Physical: '物理',
  Quantum: '量子',
  Thunder: '雷',
  Wind: '风',
};

interface StarRailCharacter {
  element: string;
  icon: string;
  id: string;
  name: string;
  path: string;
  portrait: string;
  rarity: number;
}

const useStyles = createStyles(({ css, responsive }) => ({
  body: css`
    overflow: auto;
    height: 100%;
    padding: 32px;
    background:
      radial-gradient(circle at 8% 0%, rgb(120 70 224 / 24%), transparent 31%),
      radial-gradient(circle at 93% 7%, rgb(236 113 190 / 16%), transparent 27%);

    ${responsive.mobile} {
      padding: 20px 16px;
    }
  `,
  content: css`
    max-width: 1440px;
    margin: 0 auto;
  `,
  heading: css`
    margin: 0;
    font-size: 32px;
    font-weight: 800;
    letter-spacing: -0.04em;
  `,
  intro: css`
    margin: 8px 0 0;
    color: rgb(180 196 232 / 82%);
  `,
  controls: css`
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: center;
    justify-content: space-between;
    margin: 28px 0 18px;
  `,
  filters: css`
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  `,
  grid: css`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(152px, 1fr));
    gap: 14px;
  `,
  card: css`
    cursor: pointer;
    overflow: hidden;
    position: relative;
    min-height: 246px;
    border: 1px solid rgb(162 181 255 / 14%);
    border-radius: 16px;
    background: rgb(12 22 52 / 78%);
    box-shadow: 0 14px 30px rgb(0 0 0 / 16%);
    transition: transform 0.2s ease, border-color 0.2s ease;

    &:hover {
      transform: translateY(-4px);
      border-color: rgb(231 154 237 / 76%);
    }
  `,
  cardActive: css`
    border-color: #f6a9e8;
    box-shadow: 0 0 0 2px rgb(246 169 232 / 24%), 0 16px 34px rgb(83 38 137 / 30%);
  `,
  portrait: css`
    width: 100%;
    height: 246px;
    object-fit: cover;
    object-position: center top;
    background: linear-gradient(135deg, #322063, #0a1535);
  `,
  cardInfo: css`
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    padding: 34px 12px 12px;
    color: white;
    background: linear-gradient(transparent, rgb(5 10 27 / 96%));
  `,
  name: css`
    font-weight: 800;
  `,
  detail: css`
    margin-top: 4px;
    color: rgb(232 232 255 / 76%);
    font-size: 12px;
  `,
  selected: css`
    position: sticky;
    bottom: 16px;
    display: flex;
    gap: 12px;
    align-items: center;
    width: fit-content;
    max-width: 100%;
    margin: 24px auto 0;
    padding: 10px 12px 10px 10px;
    border: 1px solid rgb(255 204 247 / 24%);
    border-radius: 18px;
    background: rgb(14 20 49 / 92%);
    box-shadow: 0 14px 46px rgb(0 0 0 / 38%);
    backdrop-filter: blur(18px);
  `,
  selectedIcon: css`
    width: 46px;
    height: 46px;
    border-radius: 50%;
  `,
}));

const fetchCharacters = async () => {
  const response = await fetch('/api/starrail/characters');
  if (!response.ok) throw new Error('角色资料暂时无法加载');
  return (await response.json()) as { items: StarRailCharacter[] };
};

const StarRailRoster = () => {
  const { styles, cx } = useStyles();
  const router = useRouter();
  const addLocalAgent = useAgentStore((s) => s.addLocalAgent);
  const createSession = useSessionStore((s) => s.createSession);
  const [keyword, setKeyword] = useState('');
  const [path, setPath] = useState('全部命途');
  const [rarity, setRarity] = useState('全部星级');
  const [selected, setSelected] = useState<StarRailCharacter>();
  const { data, isLoading, error } = useSWR('starrail-character-roster', fetchCharacters, {
    revalidateOnFocus: false,
  });

  const characters = data?.items || [];
  const pathOptions = useMemo(
    () => ['全部命途', ...Array.from(new Set(characters.map((character) => PATH_LABELS[character.path])))],
    [characters],
  );
  const filtered = useMemo(
    () =>
      characters.filter((character) => {
        const matchingKeyword = `${character.name}${PATH_LABELS[character.path]}${ELEMENT_LABELS[character.element]}`
          .toLowerCase()
          .includes(keyword.trim().toLowerCase());
        const matchingPath = path === '全部命途' || PATH_LABELS[character.path] === path;
        const matchingRarity = rarity === '全部星级' || String(character.rarity) === rarity;
        return matchingKeyword && matchingPath && matchingRarity;
      }),
    [characters, keyword, path, rarity],
  );

  const startChat = () => {
    if (!selected) return;
    const agent: Agent = {
      agentId: `starrail-${selected.id}`,
      author: '崩坏：星穹铁道角色图鉴',
      greeting: `你好呀，我是${selected.name}。很高兴在列车上与你相遇。`,
      meta: {
        avatar: selected.icon,
        category: RoleCategoryEnum.GAME,
        cover: selected.portrait,
        description: `${selected.rarity}★ · ${PATH_LABELS[selected.path]} · ${ELEMENT_LABELS[selected.element]}`,
        gender: GenderEnum.FEMALE,
        name: selected.name,
        readme: '角色资料与立绘资源来自 StarRailRes，仅用于本地图鉴与角色会话演示。',
      },
      systemRole: `你正在扮演《崩坏：星穹铁道》中的${selected.name}。请以该角色公开设定为创作灵感，用自然、友善且一致的口吻与用户交流；不确定的设定请坦诚说明，不要编造官方剧情或数值。`,
      ...DEFAULT_LLM_CONFIG,
    };

    addLocalAgent(agent);
    createSession(agent);
    router.push('/chat');
  };

  return (
    <main className={styles.body}>
      <div className={styles.content}>
        <Flexbox horizontal align="center" gap={10}>
          <Sparkles color="#f3a6df" size={24} />
          <h1 className={styles.heading}>星穹角色图鉴</h1>
        </Flexbox>
        <p className={styles.intro}>
          已收录 {characters.length || '…'} 位已命名角色。选择一位角色，即可将其加入本地会话开始交流。
        </p>

        <div className={styles.controls}>
          <Input
            allowClear
            prefix={<Search size={16} />}
            placeholder="搜索角色、命途或属性"
            style={{ maxWidth: 300 }}
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
          />
          <div className={styles.filters}>
            <Segmented options={pathOptions} value={path} onChange={(value) => setPath(String(value))} />
            <Segmented
              options={['全部星级', { label: '5★', value: '5' }, { label: '4★', value: '4' }]}
              value={rarity}
              onChange={(value) => setRarity(String(value))}
            />
          </div>
        </div>

        {isLoading ? (
          <Flexbox align="center" justify="center" style={{ minHeight: 360 }}>
            <Spin size="large" />
          </Flexbox>
        ) : error ? (
          <Empty description="角色资料暂时无法加载，请稍后刷新重试" style={{ marginTop: 100 }} />
        ) : (
          <>
            <div className={styles.grid}>
              {filtered.map((character) => (
                <article
                  className={cx(styles.card, selected?.id === character.id && styles.cardActive)}
                  key={character.id}
                  onClick={() => setSelected(character)}
                >
                  <img
                    alt={character.name}
                    className={styles.portrait}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    src={character.portrait}
                  />
                  <div className={styles.cardInfo}>
                    <div className={styles.name}>{character.name}</div>
                    <div className={styles.detail}>
                      {character.rarity}★ · {PATH_LABELS[character.path]} · {ELEMENT_LABELS[character.element]}
                    </div>
                  </div>
                </article>
              ))}
            </div>
            {filtered.length === 0 && <Empty description="没有找到相符的角色" style={{ marginTop: 100 }} />}
          </>
        )}

        {selected && (
          <div className={styles.selected}>
            <img alt="" className={styles.selectedIcon} src={selected.icon} />
            <Flexbox gap={1} style={{ minWidth: 130 }}>
              <strong>{selected.name}</strong>
              <span className={styles.detail}>
                {selected.rarity}★ · {PATH_LABELS[selected.path]} · {ELEMENT_LABELS[selected.element]}
              </span>
            </Flexbox>
            <Button type="primary" onClick={startChat}>
              加入会话
            </Button>
          </div>
        )}
        <p className={styles.intro} style={{ fontSize: 12, marginTop: 18 }}>
          资料与图片来源：StarRailRes 开源游戏资源索引。角色归米哈游/HoYoverse 所有。
        </p>
      </div>
    </main>
  );
};

export default memo(StarRailRoster);
