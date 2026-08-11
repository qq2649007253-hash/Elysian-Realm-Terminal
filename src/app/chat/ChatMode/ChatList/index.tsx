import { useResponsive } from 'antd-style';
import { isEqual } from 'lodash-es';
import dynamic from 'next/dynamic';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { sessionSelectors, useSessionStore } from '@/store/session';

import SkeletonList from './SkeletonList';
import Welcome from './WelcomeMessage';
import { useStyles } from './style';

const Loading = () => (
  <div style={{ margin: '0 auto' }}>
    <SkeletonList />
  </div>
);

const ChatList = dynamic(() => import('./VirtualizedList'), {
  ssr: false,
  loading: Loading,
});

const Conversation = memo(() => {
  const { mobile } = useResponsive();
  const { styles } = useStyles();

  const data = useSessionStore((s) => sessionSelectors.currentChatIDs(s), isEqual);
  const agent = useSessionStore((s) => sessionSelectors.currentAgent(s), isEqual);
  const background = agent?.meta.cover || '/elysia-chat-background.png';

  return (
    <Flexbox
      flex={1}
      className={styles.conversation}
      style={{
        background: `linear-gradient(90deg, rgb(6 10 28 / 70%), rgb(10 13 35 / 36%) 46%, rgb(6 10 28 / 65%)), linear-gradient(0deg, rgb(6 10 28 / 28%), rgb(6 10 28 / 28%)), url(${background}) center / cover no-repeat`,
        overflowX: 'hidden',
        overflowY: 'auto',
        position: 'relative',
      }}
      width={'100%'}
    >
      {data.length === 0 ? <Welcome /> : <ChatList mobile={mobile} data={data} />}
    </Flexbox>
  );
});

export default Conversation;
