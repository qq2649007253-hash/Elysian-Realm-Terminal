import { createStyles } from 'antd-style';
import NextImage from 'next/image';

import { AVATAR_IMAGE_SIZE, STARRAIL_AVATAR_URL } from '@/constants/common';

const useStyle = createStyles(
  ({ css, token }) => css`
    cursor: pointer;
    overflow: hidden;
    border-radius: 50%;
    transition:
      scale 400ms ${token.motionEaseOut},
      box-shadow 100ms ${token.motionEaseOut};

    &:hover {
      box-shadow: 0 0 0 3px ${token.colorText};
    }

    &:active {
      scale: 0.8;
    }
  `,
);

interface Props {
  avatar?: string;
  size?: number;
}

export default (props: Props) => {
  const { size = AVATAR_IMAGE_SIZE } = props;
  const { styles } = useStyle();
  return (
    <NextImage
      className={styles}
      alt="星轨资料终端头像"
      height={size}
      src={STARRAIL_AVATAR_URL}
      unoptimized
      width={size}
    />
  );
};
