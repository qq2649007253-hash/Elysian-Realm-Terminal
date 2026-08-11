import { DraggablePanel } from '@lobehub/ui';
import { Skeleton, Space } from 'antd';
import { createStyles, useResponsive } from 'antd-style';
import isEqual from 'lodash-es/isEqual';
import dynamic from 'next/dynamic';
import React, { memo, useEffect, useState } from 'react';
import { Flexbox } from 'react-layout-kit';

import { CHAT_HEADER_HEIGHT, SIDEBAR_WIDTH } from '@/constants/token';
import { useGlobalStore } from '@/store/global';
import { sessionSelectors, useSessionStore } from '@/store/session';

const AgentDetail = dynamic(() => import('./AgentDetail'), {
  ssr: false,
  loading: () => (
    <Flexbox style={{ padding: 12 }} gap={16} align={'center'} justify={'center'}>
      <Skeleton.Avatar active shape="circle" size={96} />
      <Skeleton.Input active size="small" />
      <Skeleton active paragraph={{ rows: 2, width: '100%' }} title={false} />
      <Space>
        <Skeleton.Button active />
        <Skeleton.Button active />
      </Space>
      <Skeleton active paragraph={{ rows: 3, width: '100%' }} title={false} />
    </Flexbox>
  ),
});

const useStyles = createStyles(({ css }) => ({
  content: css`
    display: flex;
    flex-direction: column;
    height: 100% !important;
  `,
  drawer: css`
    z-index: 10;
    border-left: 1px solid rgb(139 188 255 / 18%);
    background-color: #071029;
    box-shadow: -12px 0 44px rgb(0 0 0 / 16%);
    backdrop-filter: saturate(180%) blur(18px);
  `,
}));

const ChatInfo = memo(() => {
  const { styles } = useStyles();
  const { md = true, lg = true } = useResponsive();
  const agent = useSessionStore((s) => sessionSelectors.currentAgent(s), isEqual);
  const background = agent?.meta.cover || '/elysia-profile-background.png';

  const [showAgentInfo, setShowAgentInfo] = useGlobalStore((s) => [
    s.showAgentInfo,
    s.setShowAgentInfo,
  ]);

  const [cacheExpand, setCacheExpand] = useState<boolean>(Boolean(showAgentInfo));

  const handleExpand = (expand: boolean) => {
    if (isEqual(expand, Boolean(showAgentInfo))) return;
    setShowAgentInfo(expand);
    setCacheExpand(expand);
  };

  useEffect(() => {
    if (lg && cacheExpand) setShowAgentInfo(true);
    if (!lg) setShowAgentInfo(false);
  }, [lg, cacheExpand]);

  return (
    <DraggablePanel
      className={styles.drawer}
      classNames={{
        content: styles.content,
      }}
      minWidth={SIDEBAR_WIDTH}
      mode={md ? 'fixed' : 'float'}
      placement={'right'}
      onExpandChange={handleExpand}
      expand={showAgentInfo}
      style={{
        background: `linear-gradient(180deg, rgb(21 10 35 / 48%), rgb(9 13 32 / 92%) 72%, rgb(7 13 31 / 98%)), linear-gradient(90deg, rgb(20 11 44 / 22%), rgb(20 11 44 / 22%)), url(${background}) center top / cover no-repeat`,
      }}
    >
      <div style={{ height: `calc(100vh - ${CHAT_HEADER_HEIGHT}px)`, overflowY: 'auto' }}>
        <AgentDetail />
      </div>
    </DraggablePanel>
  );
});

export default memo(ChatInfo);
