import { createStyles } from 'antd-style';

import { CHAT_HEADER_HEIGHT, CHAT_INPUT_WIDTH } from '@/constants/token';

export const useStyles = createStyles(({ css, token, responsive }) => ({
  chat: css`
    overflow: hidden;
    isolation: isolate;

    background:
      linear-gradient(90deg, rgb(88 122 255 / 4%) 1px, transparent 1px),
      linear-gradient(rgb(88 122 255 / 4%) 1px, transparent 1px),
      radial-gradient(circle at 55% 8%, rgb(112 171 255 / 14%), transparent 36rem),
      #080d1c;
    background-size: 42px 42px, 42px 42px, auto, auto;

    &::before {
      position: absolute;
      z-index: -1;
      top: -28%;
      left: 38%;
      width: 52rem;
      height: 52rem;
      border: 1px solid rgb(143 199 255 / 15%);
      border-radius: 50%;
      box-shadow: 0 0 0 58px rgb(143 199 255 / 3%), 0 0 70px rgb(101 146 255 / 18%);
      content: '';
    }
  `,
  list: css`
    margin-top: ${CHAT_HEADER_HEIGHT}px;
  `,
  input: css`
    width: ${CHAT_INPUT_WIDTH};
    min-width: 360px;
    max-width: 100vw;

    ${responsive.mobile} {
      width: 100%;
    }
  `,

  docker: css`
    width: 100%;
    padding: ${token.paddingSM}px 20px 20px;

    > div {
      padding: 10px 12px;
      border: 1px solid rgb(128 177 255 / 28%);
      border-radius: 18px;
      background: linear-gradient(135deg, rgb(19 31 58 / 94%), rgb(12 18 38 / 94%));
      box-shadow: 0 14px 36px rgb(0 0 0 / 22%), inset 0 1px rgb(221 239 255 / 8%);
      backdrop-filter: blur(18px);
    }
  `,
}));
