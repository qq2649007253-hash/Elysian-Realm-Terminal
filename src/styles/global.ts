import { css } from 'antd-style';

export default ({ prefixCls }: { prefixCls: string }) => css`
  html,
  body,
  #__next,
  .${prefixCls}-app {
    position: relative;
    overscroll-behavior: none;
    height: 100% !important;
    min-height: 100% !important;

    color-scheme: dark;
    background:
      radial-gradient(circle at 72% 18%, rgb(88 121 255 / 20%), transparent 24rem),
      radial-gradient(circle at 20% 78%, rgb(55 207 210 / 12%), transparent 28rem),
      #080d1c;

    ::-webkit-scrollbar {
      display: none;
      width: 0;
      height: 0;
    }
  }

  p {
    margin-bottom: 0;
  }

  body {
    color: #e8ecff;
    background-color: #080d1c;
  }

  ::selection {
    color: #07101d;
    background: #a9dcff;
  }

  @media (max-width: 575px) {
    * {
      ::-webkit-scrollbar {
        display: none;
        width: 0;
        height: 0;
      }
    }
  }
`;
