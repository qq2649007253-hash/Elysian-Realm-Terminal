export const AGENT_MARKET_URL = 'https://vidol-market.lobehub.com/agents';

export const DANCE_INDEX_URL = 'https://vidol-market.lobehub.com/dances/index.json';

export const OSS_PREFIX = 'https://r2.vidol.chat';

export const COOKIE_CACHE_DAYS = 30;

export const LOADING_FLAG = '...';

export const DEFAULT_USER_AVATAR = '😀';

export const MAX_NAME_LENGTH = 64;

export const MAX_WIDTH = 1024;
export const MAX_DESCRIPTION_LENGTH = 100;
export const MAX_GREETING_LENGTH = 200;
export const MAX_README_LENGTH = 9999;

export const MAX_SYSTEM_ROLE_LENGTH = 9999;

export const AVATAR_IMAGE_SIZE = 48;
export const AVATAR_COMPRESS_SIZE = 256;

export const DANCE_IMAGE_SIZE = 48;
export const DANCE_COMPRESS_SIZE = 256;

export const COVER_IMAGE_SIZE = 320;

export const COVER_COMPRESS_SIZE = COVER_IMAGE_SIZE * 2;

/**
 * VRM 模型和 MMD 的模型比例大致为 0.085 ~ 0.1，仅是估算值.
 * 1. VRM模型通常以米为单位，1个单位 = 1米, 标准VRM模型身高通常在1.5到1.8米之间
 * 2. MMD模型的1个单位 ≈ 1厘米，标准MMD模型身高 ≈ 20单位 ≈ 20厘米
 * 3. 所以 MMD 的 VMD 文件比例尺是不一样的。
 */
export const VRM_TO_MMD_SCALE = 0.085;

export const STARRAIL_AVATAR_URL = '/starrail-avatar.png';

export const DEFAULT_USER_AVATAR_URL = STARRAIL_AVATAR_URL;

export const DEFAULT_AGENT_AVATAR_URL = STARRAIL_AVATAR_URL;
export const ROLE_VIEWER_HEIGHT = 800;
export const ROLE_VIEWER_WIDTH = 480;

export const PWA_INSTALL_ID = 'pwa-install';
