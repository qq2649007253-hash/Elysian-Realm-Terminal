import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, responsive }) => ({
  header: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 58px;
    padding: 8px 18px;
    border-bottom: 1px solid rgb(139 188 255 / 16%);
    background: linear-gradient(90deg, rgb(13 23 48 / 88%), rgb(13 23 48 / 36%));
    box-shadow: inset 0 -1px rgb(255 255 255 / 2%);
    backdrop-filter: blur(16px);
  `,
  leftSection: css`
    flex: 1;
    min-width: 0;
    margin-right: 16px;
  `,
  agentMetaWrapper: css`
    overflow: hidden;
    flex: 1;
    min-width: 0;
  `,
  actions: css`
    display: flex;
    flex-shrink: 0;
    align-items: center;

    ${responsive.mobile} {
      flex-wrap: wrap;
      justify-content: flex-end;
    }
  `,
  terminalStatus: css`
    display: flex;
    gap: 8px;
    align-items: center;
    margin-right: 8px;
    padding: 5px 9px;
    border: 1px solid rgb(113 224 241 / 24%);
    border-radius: 999px;
    color: rgb(177 236 255 / 90%);
    background: rgb(62 194 219 / 8%);
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 11px;
    letter-spacing: 0.08em;

    &::before {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #75f0dc;
      box-shadow: 0 0 10px #75f0dc;
      content: '';
    }

    ${responsive.mobile} {
      display: none;
    }
  `,
}));
