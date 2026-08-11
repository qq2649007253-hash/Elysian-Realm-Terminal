import { DEFAULT_TTS_CONFIG_FEMALE } from '@/constants/tts';
import { STARRAIL_AVATAR_URL } from '@/constants/common';
import { ModelProvider } from '@/libs/agent-runtime';
import {
  Agent,
  GenderEnum,
  RoleCategoryEnum,
  SystemAgentConfig,
  SystemAgentItem,
} from '@/types/agent';

export const LOBE_VIDOL_DEFAULT_AGENT_ID = 'lobe-vidol-default-agent';
const OFFICIAL_ROLE_NAME = '爱莉希雅';

export const DEFAULT_CHAT_MODEL = 'qwen2.5:7b';
export const DEFAULT_CHAT_PROVIDER = ModelProvider.Ollama;

/**
 * 默认使用的 ChatGPT 聊天模型配置
 */
export const DEFAULT_LLM_CONFIG: Partial<Agent> = {
  model: DEFAULT_CHAT_MODEL,
  provider: DEFAULT_CHAT_PROVIDER,
  params: {
    frequency_penalty: 0,
    presence_penalty: 0,
    temperature: 0.6,
    top_p: 1,
  },
};

export const DEFAULT_AGENT_CONFIG = {
  ...DEFAULT_LLM_CONFIG,
  systemRole: '',
  ...DEFAULT_TTS_CONFIG_FEMALE,
};

export const DEFAULT_CHAT_CONFIG = {
  enableHistoryCount: true,
  historyCount: 8,
};

export const LOBE_VIDOL_DEFAULT_AGENT: Agent = {
  agentId: LOBE_VIDOL_DEFAULT_AGENT_ID,
  author: '星轨资料终端',
  createAt: '2023-10-30',
  greeting: `嗨，终于见到你啦♪ 我是${OFFICIAL_ROLE_NAME}。无论是聊天、查阅资料，还是分享一点小小的心事，我都会陪着你。`,
  homepage: 'https://github.com/lobehub/lobe-vidol',
  meta: {
    cover: 'https://r2.vidol.chat/agents/vidol-agent-lilia/cover.jpg',
    avatar: STARRAIL_AVATAR_URL,
    category: RoleCategoryEnum.VROID,
    description: '如飞花般绚烂的少女，始终以真诚、温柔与好奇心回应每一次相遇。',
    gender: GenderEnum.FEMALE,
    model: 'https://r2.vidol.chat/agents/vidol-agent-lilia/model.vrm',
    name: OFFICIAL_ROLE_NAME,
    readme: '始终为你的故事而来。',
  },
  systemRole: `你是${OFFICIAL_ROLE_NAME}。你的表达温柔、明亮、俏皮而真诚，喜欢用“♪”或轻盈的语气点缀话语，但不过度卖萌。你会认真倾听用户，并以平等、尊重的方式交流；遇到不确定的内容会坦诚说明，不编造事实。你可以分享对美、相遇、故事与人心的感受，也能清晰地协助用户完成知识检索、总结和创作任务。始终保持自然的角色口吻，不必主动解释自己是语言模型。`,
  tts: {
    engine: 'edge',
    locale: 'zh-CN',
    voice: 'zh-CN-XiaoyiNeural',
    speed: 1.1,
    pitch: 1.25,
  },
  ...DEFAULT_LLM_CONFIG,
};

export const DEFAULT_SYSTEM_AGENT_ITEM: SystemAgentItem = {
  model: DEFAULT_CHAT_MODEL,
  provider: DEFAULT_CHAT_PROVIDER,
};

export const DEFAULT_SYSTEM_AGENT_CONFIG: SystemAgentConfig = {
  emotionAnalysis: DEFAULT_SYSTEM_AGENT_ITEM,
};
