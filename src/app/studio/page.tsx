'use client';

import {
  Button,
  Card,
  Empty,
  Form,
  Input,
  List,
  Popconfirm,
  Select,
  Space,
  Tag,
  Upload,
  message,
} from 'antd';
import { createStyles } from 'antd-style';
import {
  Bot,
  CheckCircle2,
  Clock3,
  Download,
  FileUp,
  Plus,
  Rocket,
  Save,
  Trash2,
  Wifi,
  XCircle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { Flexbox } from 'react-layout-kit';

import { DEFAULT_LLM_CONFIG } from '@/constants/agent';
import { useAgentStore } from '@/store/agent';
import { useSessionStore } from '@/store/session';
import { Agent, GenderEnum, RoleCategoryEnum } from '@/types/agent';

import type { StudioCharacter, StudioExport } from './types';

const STORAGE_KEY = 'elysian-agent-studio-v1';

const createId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `studio-${Date.now()}-${Math.random().toString(36).slice(2)}`;

const blankCharacter = (): StudioCharacter => {
  const now = new Date().toISOString();
  return {
    avatar: '/starrail-avatar.png',
    cover: '/elysia-chat-background.png',
    createdAt: now,
    description: '一个正在构建中的智能角色',
    gender: 'Female',
    greeting: '你好，很高兴认识你。',
    id: createId(),
    knowledge: '',
    model: 'qwen2.5:7b',
    name: '未命名角色',
    systemRole: '你是一个友善、可靠的智能助手。',
    updatedAt: now,
    versions: [],
  };
};

const useStyles = createStyles(({ css, token, responsive }) => ({
  shell: css`
    overflow: hidden;
    width: 100%;
    height: 100%;
    background:
      radial-gradient(circle at 12% 0%, rgb(106 79 226 / 22%), transparent 32%),
      radial-gradient(circle at 92% 8%, rgb(239 120 203 / 14%), transparent 26%), #070d20;
  `,
  sidebar: css`
    overflow: auto;
    width: 280px;
    padding: 20px 14px;
    border-right: 1px solid rgb(148 169 229 / 14%);
    background: rgb(8 15 37 / 78%);

    ${responsive.mobile} {
      display: none;
    }
  `,
  main: css`
    overflow: auto;
    flex: 1;
    padding: 28px;

    ${responsive.mobile} {
      padding: 18px 12px;
    }
  `,
  content: css`
    max-width: 1180px;
    margin: 0 auto;
  `,
  title: css`
    margin: 0;
    font-size: 30px;
    letter-spacing: -0.03em;
  `,
  subtitle: css`
    margin-top: 6px;
    color: ${token.colorTextSecondary};
  `,
  status: css`
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: center;
    justify-content: space-between;
    margin: 22px 0;
    padding: 13px 16px;
    border: 1px solid rgb(146 170 232 / 16%);
    border-radius: 14px;
    background: rgb(12 22 53 / 78%);
  `,
  grid: css`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;

    ${responsive.mobile} {
      grid-template-columns: 1fr;
    }
  `,
  wide: css`
    grid-column: 1 / -1;
  `,
  agentItem: css`
    cursor: pointer;
    margin-bottom: 7px;
    padding: 10px;
    border: 1px solid transparent;
    border-radius: 12px;
    transition: 0.2s ease;

    &:hover {
      background: rgb(255 255 255 / 5%);
    }
  `,
  active: css`
    border-color: rgb(241 160 224 / 55%);
    background: rgb(129 79 180 / 18%);
  `,
  avatar: css`
    width: 42px;
    height: 42px;
    border-radius: 50%;
    object-fit: cover;
  `,
  metric: css`
    color: ${token.colorTextSecondary};
    font-size: 12px;
  `,
}));

interface OllamaState {
  error?: string;
  latency?: number;
  models: Array<{ modified_at?: string; name: string; size?: number }>;
  ok: boolean;
}

const Studio = () => {
  const { styles, cx } = useStyles();
  const router = useRouter();
  const [form] = Form.useForm<StudioCharacter>();
  const [characters, setCharacters] = useState<StudioCharacter[]>([]);
  const [activeId, setActiveId] = useState('');
  const [ready, setReady] = useState(false);
  const [checking, setChecking] = useState(false);
  const [ollama, setOllama] = useState<OllamaState>({ models: [], ok: false });
  const importRef = useRef<HTMLInputElement>(null);
  const watchedAvatar = Form.useWatch('avatar', form);
  const addLocalAgent = useAgentStore((s) => s.addLocalAgent);
  const createSession = useSessionStore((s) => s.createSession);

  const active = useMemo(
    () => characters.find((character) => character.id === activeId),
    [activeId, characters],
  );

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as StudioCharacter[];
      const initial = saved.length ? saved : [blankCharacter()];
      setCharacters(initial);
      setActiveId(initial[0].id);
    } catch {
      const initial = blankCharacter();
      setCharacters([initial]);
      setActiveId(initial.id);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(STORAGE_KEY, JSON.stringify(characters));
  }, [characters, ready]);

  useEffect(() => {
    if (active) form.setFieldsValue(active);
  }, [active, form]);

  const createCharacter = () => {
    const character = blankCharacter();
    setCharacters((items) => [character, ...items]);
    setActiveId(character.id);
  };

  const saveCharacter = async (withVersion = false) => {
    const values = await form.validateFields();
    if (!active) return;
    const now = new Date().toISOString();
    const next: StudioCharacter = {
      ...active,
      ...values,
      updatedAt: now,
      versions: withVersion
        ? [
            {
              createdAt: now,
              id: createId(),
              note: `保存于 ${new Date(now).toLocaleString('zh-CN')}`,
              systemRole: values.systemRole,
            },
            ...active.versions,
          ].slice(0, 20)
        : active.versions,
    };
    setCharacters((items) => items.map((item) => (item.id === active.id ? next : item)));
    message.success(withVersion ? '已保存并创建人设版本' : '角色草稿已保存');
  };

  const checkOllama = async () => {
    setChecking(true);
    try {
      const response = await fetch('/api/ollama/status', { cache: 'no-store' });
      const result = (await response.json()) as OllamaState;
      setOllama(result);
      if (result.ok) message.success(`Ollama 已连接，发现 ${result.models.length} 个模型`);
      else message.error('Ollama 连接失败');
    } catch (error) {
      setOllama({ error: error instanceof Error ? error.message : '连接失败', models: [], ok: false });
    } finally {
      setChecking(false);
    }
  };

  const removeCharacter = () => {
    if (!active) return;
    const next = characters.filter((item) => item.id !== active.id);
    const fallback = next.length ? next : [blankCharacter()];
    setCharacters(fallback);
    setActiveId(fallback[0].id);
  };

  const exportCharacter = async () => {
    await saveCharacter();
    const values = await form.validateFields();
    if (!active) return;
    const payload: StudioExport = {
      character: { ...active, ...values, updatedAt: new Date().toISOString() },
      exportedAt: new Date().toISOString(),
      format: 'elysian-agent-studio',
      version: 1,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${values.name || 'agent'}.agent.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const importCharacter = async (file: File) => {
    try {
      const payload = JSON.parse(await file.text()) as StudioExport;
      if (payload.format !== 'elysian-agent-studio' || !payload.character?.name) {
        throw new Error('不是有效的工作台角色文件');
      }
      const now = new Date().toISOString();
      const imported = { ...payload.character, id: createId(), updatedAt: now };
      setCharacters((items) => [imported, ...items]);
      setActiveId(imported.id);
      message.success(`已导入角色：${imported.name}`);
    } catch (error) {
      message.error(error instanceof Error ? error.message : '导入失败');
    }
  };

  const publish = async () => {
    await saveCharacter(true);
    const values = await form.validateFields();
    if (!active) return;
    const knowledge = values.knowledge.trim();
    const agent: Agent = {
      agentId: `studio-${active.id}`,
      author: '角色智能体工作台',
      greeting: values.greeting,
      meta: {
        avatar: values.avatar,
        category: RoleCategoryEnum.GAME,
        cover: values.cover,
        description: values.description,
        gender: values.gender === 'Male' ? GenderEnum.MALE : GenderEnum.FEMALE,
        name: values.name,
        readme: `由角色智能体工作台创建 · ${knowledge ? '已挂载知识资料' : '未挂载知识资料'}`,
      },
      model: values.model,
      provider: DEFAULT_LLM_CONFIG.provider,
      params: DEFAULT_LLM_CONFIG.params,
      systemRole: [
        values.systemRole.trim(),
        knowledge && `以下是角色可参考的私有知识资料。回答时优先依据资料；资料未提及的事实不要编造：\n\n${knowledge}`,
      ]
        .filter(Boolean)
        .join('\n\n---\n\n'),
    };
    addLocalAgent(agent);
    createSession(agent);
    message.success('角色已发布到会话');
    router.push('/chat');
  };

  if (!ready) return null;

  return (
    <Flexbox className={styles.shell} horizontal>
      <aside className={styles.sidebar}>
        <Flexbox horizontal justify="space-between" align="center" style={{ marginBottom: 16 }}>
          <strong>角色项目</strong>
          <Button icon={<Plus size={15} />} onClick={createCharacter} size="small" />
        </Flexbox>
        {characters.map((character) => (
          <Flexbox
            align="center"
            className={cx(styles.agentItem, activeId === character.id && styles.active)}
            gap={10}
            horizontal
            key={character.id}
            onClick={() => setActiveId(character.id)}
          >
            <img alt="" className={styles.avatar} src={character.avatar} />
            <Flexbox gap={2} style={{ minWidth: 0 }}>
              <strong>{character.name}</strong>
              <span className={styles.metric}>{character.model}</span>
            </Flexbox>
          </Flexbox>
        ))}
      </aside>

      <main className={styles.main}>
        <div className={styles.content}>
          <Flexbox horizontal align="center" gap={12}>
            <Bot color="#f2a7df" size={30} />
            <div>
              <h1 className={styles.title}>角色智能体工作台</h1>
              <div className={styles.subtitle}>从角色设计、模型检测、知识挂载到发布会话的完整开发流程</div>
            </div>
          </Flexbox>

          <div className={styles.status}>
            <Space wrap>
              {ollama.ok ? (
                <Tag color="success" icon={<CheckCircle2 size={13} />}>Ollama 已连接</Tag>
              ) : (
                <Tag color="default" icon={<XCircle size={13} />}>Ollama 未检测</Tag>
              )}
              {ollama.latency !== undefined && <Tag>{ollama.latency} ms</Tag>}
              {ollama.ok && <span className={styles.metric}>{ollama.models.length} 个本地模型可用</span>}
              {ollama.error && <span className={styles.metric}>{ollama.error}</span>}
            </Space>
            <Button icon={<Wifi size={15} />} loading={checking} onClick={checkOllama}>
              检测本地模型
            </Button>
          </div>

          {active ? (
            <Form form={form} layout="vertical" initialValues={active}>
              <div className={styles.grid}>
                <Card title="基础身份">
                  <Form.Item label="角色名称" name="name" rules={[{ required: true, message: '请输入角色名称' }]}>
                    <Input maxLength={64} />
                  </Form.Item>
                  <Form.Item label="角色简介" name="description">
                    <Input.TextArea maxLength={160} rows={2} showCount />
                  </Form.Item>
                  <Form.Item label="性别" name="gender">
                    <Select options={[{ label: '女性', value: 'Female' }, { label: '男性', value: 'Male' }]} />
                  </Form.Item>
                  <Form.Item label="开场白" name="greeting">
                    <Input.TextArea maxLength={300} rows={3} showCount />
                  </Form.Item>
                </Card>

                <Card title="视觉资源">
                  <Form.Item label="头像 URL" name="avatar" rules={[{ required: true }]}>
                    <Input placeholder="https://... 或 /public-image.png" />
                  </Form.Item>
                  <Form.Item label="聊天背景 / 角色立绘 URL" name="cover" rules={[{ required: true }]}>
                    <Input placeholder="https://... 或 /public-image.png" />
                  </Form.Item>
                  <Flexbox horizontal gap={12} align="center">
                    <img alt="角色预览" className={styles.avatar} src={watchedAvatar} />
                    <span className={styles.metric}>发布后会自动同步到会话头像和背景</span>
                  </Flexbox>
                </Card>

                <Card title="模型配置">
                  <Form.Item label="Ollama 模型" name="model" rules={[{ required: true }]}>
                    <Select
                      showSearch
                      options={(ollama.models.length
                        ? ollama.models.map((model) => ({ label: model.name, value: model.name }))
                        : [{ label: 'qwen2.5:7b', value: 'qwen2.5:7b' }])}
                    />
                  </Form.Item>
                  <div className={styles.metric}>
                    点击上方“检测本地模型”，工作台会直接读取 Ollama 的已安装模型列表和响应耗时。
                  </div>
                </Card>

                <Card title="版本历史">
                  {active.versions.length ? (
                    <List
                      dataSource={active.versions}
                      size="small"
                      renderItem={(version) => (
                        <List.Item
                          actions={[
                            <Button
                              key="restore"
                              onClick={() => form.setFieldValue('systemRole', version.systemRole)}
                              size="small"
                              type="link"
                            >
                              恢复
                            </Button>,
                          ]}
                        >
                          <List.Item.Meta
                            avatar={<Clock3 size={16} />}
                            description={version.note}
                            title={version.systemRole.slice(0, 28) || '空人设'}
                          />
                        </List.Item>
                      )}
                    />
                  ) : (
                    <Empty description="保存人设版本后会在这里出现" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                  )}
                </Card>

                <Card className={styles.wide} title="人设提示词">
                  <Form.Item name="systemRole" rules={[{ required: true, message: '请输入人设提示词' }]}>
                    <Input.TextArea rows={9} showCount maxLength={10_000} />
                  </Form.Item>
                </Card>

                <Card className={styles.wide} title="角色知识资料">
                  <Form.Item name="knowledge">
                    <Input.TextArea
                      maxLength={30_000}
                      placeholder="粘贴角色背景、人物关系、世界观、常用称呼和禁止编造的事实。发布时会与人设一起注入模型上下文。"
                      rows={10}
                      showCount
                    />
                  </Form.Item>
                </Card>
              </div>

              <Flexbox horizontal justify="space-between" gap={12} style={{ marginTop: 20 }}>
                <Space wrap>
                  <Button icon={<Save size={15} />} onClick={() => saveCharacter(false)}>保存草稿</Button>
                  <Button icon={<Clock3 size={15} />} onClick={() => saveCharacter(true)}>保存人设版本</Button>
                  <Button icon={<Download size={15} />} onClick={exportCharacter}>导出配置</Button>
                  <Upload
                    accept=".json"
                    beforeUpload={(file) => {
                      importCharacter(file);
                      return false;
                    }}
                    showUploadList={false}
                  >
                    <Button icon={<FileUp size={15} />}>导入配置</Button>
                  </Upload>
                </Space>
                <Space wrap>
                  <Popconfirm title="确定删除这个角色项目吗？" onConfirm={removeCharacter}>
                    <Button danger icon={<Trash2 size={15} />}>删除</Button>
                  </Popconfirm>
                  <Button icon={<Rocket size={15} />} onClick={publish} type="primary">发布并开始聊天</Button>
                </Space>
              </Flexbox>
            </Form>
          ) : (
            <Empty description="请创建一个角色项目" />
          )}
        </div>
      </main>
      <input hidden ref={importRef} type="file" />
    </Flexbox>
  );
};

export default memo(Studio);
