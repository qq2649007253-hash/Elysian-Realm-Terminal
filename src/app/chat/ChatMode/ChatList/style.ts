import { createStyles } from 'antd-style';

import { CHAT_INPUT_WIDTH } from '@/constants/token';

export const useStyles = createStyles(({ css, token, responsive }) => ({
  conversation: css`
    isolation: isolate;

    background:
      linear-gradient(90deg, rgb(6 10 28 / 70%), rgb(10 13 35 / 36%) 46%, rgb(6 10 28 / 65%)),
      linear-gradient(0deg, rgb(6 10 28 / 28%), rgb(6 10 28 / 28%)),
      url('/elysia-chat-background.png') center / cover no-repeat;
  `,
  header: css`
    padding: 0 ${token.paddingSM}px;
  `,
  list: css`
    position: relative;
    height: 100%;
  `,

  message: css`
    width: 100%;
    min-width: 360px;
    max-width: ${CHAT_INPUT_WIDTH};
    margin: 0 auto;

    ${responsive.mobile} {
      width: 100%;
    }
  `,
}));
