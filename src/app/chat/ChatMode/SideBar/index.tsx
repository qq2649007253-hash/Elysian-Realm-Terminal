'use client';

import { DraggablePanel } from '@lobehub/ui';
import { createStyles, useResponsive } from 'antd-style';
import isEqual from 'lodash-es/isEqual';
import { memo, useEffect, useState } from 'react';

import { SIDEBAR_WIDTH } from '@/constants/token';
import { useGlobalStore } from '@/store/global';

import ChatHeader from './ChatHeader';
import SessionList from './SessionList';

const useStyles = createStyles(({ css }) => ({
  content: css`
    display: flex;
    flex-direction: column;
    height: 100% !important;
  `,
  sidebar: css`
    z-index: 10;
    border-right: 1px solid rgb(139 188 255 / 18%);
    background: linear-gradient(180deg, rgb(14 26 56 / 96%), rgb(7 13 31 / 94%));
    box-shadow: 12px 0 44px rgb(0 0 0 / 16%);
    backdrop-filter: saturate(180%) blur(18px);
  `,
}));

const SideBar = memo(() => {
  const { styles } = useStyles();
  const [showSessionList, setSessionList] = useGlobalStore((s) => [
    s.showSessionList,
    s.setSessionList,
  ]);

  const { md = true } = useResponsive();

  const [cacheExpand, setCacheExpand] = useState<boolean>(Boolean(showSessionList));

  const handleExpand = (expand: boolean) => {
    if (isEqual(expand, Boolean(showSessionList))) return;
    setSessionList(expand);
    setCacheExpand(expand);
  };

  useEffect(() => {
    if (md && cacheExpand) setSessionList(true);
    if (!md) setSessionList(false);
  }, [md, cacheExpand]);

  return (
    <DraggablePanel
      className={styles.sidebar}
      classNames={{ content: styles.content }}
      minWidth={SIDEBAR_WIDTH}
      showHandlerWhenUnexpand={false}
      showHandlerWideArea={false}
      mode={md ? 'fixed' : 'float'}
      placement={'left'}
      onExpandChange={handleExpand}
      expand={showSessionList}
    >
      <ChatHeader />
      <SessionList />
    </DraggablePanel>
  );
});

export default memo(SideBar);
