// SPDX-License-Identifier: AGPL-3.0-or-later

import m from 'mithril';

import {
  ProviderType,
  ProviderTuning,
  ProviderConfig,
  ProviderTemplate,
  ProviderPanelAttrs,
  ProviderQuickSwitcherAttrs,
  FormState,
  TYPE_ICONS,
  CATEGORY_LABELS,
  CONNECTION_FIELD_LABELS,
  buildHeaders,
  apiUrl,
  createEmptyForm,
} from './provider_types';

export {ProviderPanelAttrs, ProviderQuickSwitcherAttrs};

const COLORS = {
  primary: 'var(--chat-primary, #3d5688)',
  primaryHover: 'var(--chat-primary-hover, #2e4470)',
  primaryLight:
    'color-mix(in srgb, var(--chat-primary, #3d5688) 12%, transparent)',
  success: 'var(--chat-success, #10b981)',
  successLight:
    'color-mix(in srgb, var(--chat-success, #10b981) 12%, transparent)',
  warning: 'var(--chat-warning, #f59e0b)',
  warningLight:
    'color-mix(in srgb, var(--chat-warning, #f59e0b) 12%, transparent)',
  error: 'var(--chat-error, #ef4444)',
  errorLight:
    'color-mix(in srgb, var(--chat-error, #ef4444) 12%, transparent)',
};

const STYLES = {
  container: {
    padding: '20px',
    height: '100%',
    overflowY: 'auto' as const,
    backgroundColor: 'var(--chat-bg)',
    color: 'var(--chat-text)',
  },
  header: {
    display: 'flex' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: '20px',
  },
  title: {
    margin: 0,
    fontSize: '18px',
    fontWeight: 600,
    color: 'var(--chat-text)',
  },
  subtitle: {
    margin: '4px 0 0 0',
    fontSize: '13px',
    color: 'var(--chat-text-secondary)',
  },
  addBtn: {
    display: 'inline-flex' as const,
    alignItems: 'center' as const,
    gap: '6px',
    padding: '10px 18px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    backgroundColor: 'var(--chat-primary, #3d5688)',
    color: 'white',
    transition: 'all 0.15s ease',
  },
  grid: {
    display: 'grid' as const,
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '14px',
  },
  card: {
    padding: '16px',
    borderRadius: '10px',
    border: '1px solid var(--chat-border)',
    backgroundColor: 'var(--chat-bg-secondary)',
    transition: 'all 0.2s ease',
    position: 'relative' as const,
    cursor: 'default',
  },
  cardActive: {
    border: `2px solid var(--chat-success, #10b981)`,
    boxShadow: '0 0 12px color-mix(in srgb, var(--chat-success, #10b981) 20%, transparent)',
  },
  cardHeader: {
    display: 'flex' as const,
    alignItems: 'center' as const,
    gap: '10px',
    marginBottom: '10px',
  },
  cardIcon: {
    fontSize: '24px',
    width: '36px',
    height: '36px',
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    borderRadius: '8px',
    backgroundColor: 'var(--chat-bg)',
    flexShrink: 0,
  },
  cardName: {
    fontSize: '15px',
    fontWeight: 600,
    color: 'var(--chat-text)',
    margin: 0,
    overflow: 'hidden' as const,
    textOverflow: 'ellipsis' as const,
    whiteSpace: 'nowrap' as const,
  },
  cardBadge: {
    display: 'inline-flex' as const,
    alignItems: 'center' as const,
    gap: '4px',
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: 500,
  },
  activeBadge: {
    backgroundColor: COLORS.successLight,
    color: COLORS.success,
  },
  categoryBadge: {
    backgroundColor: COLORS.primaryLight,
    color: COLORS.primary,
  },
  cardModels: {
    marginTop: '8px',
    fontSize: '12px',
    color: 'var(--chat-text-secondary)',
    fontFamily: 'monospace',
    lineHeight: '1.6',
  },
  cardActions: {
    display: 'flex' as const,
    gap: '6px',
    marginTop: '12px',
    borderTop: '1px solid var(--chat-border)',
    paddingTop: '12px',
  },
  actionBtn: {
    display: 'inline-flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    padding: '6px 10px',
    border: '1px solid var(--chat-border)',
    borderRadius: '6px',
    fontSize: '12px',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    color: 'var(--chat-text-secondary)',
    transition: 'all 0.15s ease',
    gap: '4px',
  },
  actionBtnDanger: {
    borderColor: 'color-mix(in srgb, var(--chat-error, #ef4444) 40%, transparent)',
    color: COLORS.error,
  },
  emptyState: {
    textAlign: 'center' as const,
    padding: '60px 20px',
    color: 'var(--chat-text-secondary)',
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '16px',
    opacity: 0.6,
  },
  loadingState: {
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    padding: '60px 20px',
    color: 'var(--chat-text-secondary)',
    fontSize: '14px',
    gap: '8px',
  },
  errorBanner: {
    display: 'flex' as const,
    gap: '10px',
    padding: '12px 14px',
    borderRadius: '8px',
    fontSize: '13px',
    marginBottom: '16px',
    backgroundColor: COLORS.errorLight,
    border: `1px solid color-mix(in srgb, var(--chat-error, #ef4444) 25%, transparent)`,
    color: COLORS.error,
  },
  successBanner: {
    display: 'flex' as const,
    gap: '10px',
    padding: '12px 14px',
    borderRadius: '8px',
    fontSize: '13px',
    marginBottom: '16px',
    backgroundColor: COLORS.successLight,
    border: `1px solid color-mix(in srgb, var(--chat-success, #10b981) 25%, transparent)`,
    color: COLORS.success,
  },
  form: {
    padding: '20px',
  },
  formSection: {
    marginBottom: '24px',
  },
  formSectionTitle: {
    margin: '0 0 14px 0',
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--chat-text-secondary)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.8px',
  },
  formField: {
    marginBottom: '16px',
  },
  formLabel: {
    display: 'block' as const,
    marginBottom: '6px',
    fontSize: '13px',
    fontWeight: 500,
    color: 'var(--chat-text)',
  },
  formInput: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid var(--chat-border)',
    borderRadius: '8px',
    backgroundColor: 'var(--chat-bg-secondary)',
    color: 'var(--chat-text)',
    fontSize: '14px',
    boxSizing: 'border-box' as const,
    transition: 'all 0.15s ease',
    fontFamily: 'inherit',
  },
  formSelect: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid var(--chat-border)',
    borderRadius: '8px',
    backgroundColor: 'var(--chat-bg-secondary)',
    color: 'var(--chat-text)',
    fontSize: '14px',
    boxSizing: 'border-box' as const,
    cursor: 'pointer',
  },
  formHint: {
    fontSize: '12px',
    color: 'var(--chat-text-secondary)',
    marginTop: '4px',
  },
  formActions: {
    display: 'flex' as const,
    gap: '10px',
    justifyContent: 'flex-end' as const,
    marginTop: '24px',
    paddingTop: '16px',
    borderTop: '1px solid var(--chat-border)',
  },
  btn: {
    display: 'inline-flex' as const,
    alignItems: 'center' as const,
    gap: '6px',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  btnPrimary: {
    backgroundColor: COLORS.primary,
    color: 'white',
  },
  btnSecondary: {
    backgroundColor: 'transparent',
    color: 'var(--chat-text-secondary)',
    border: '1px solid var(--chat-border)',
  },
  btnSuccess: {
    backgroundColor: COLORS.success,
    color: 'white',
  },
  btnDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  tuningToggle: {
    display: 'flex' as const,
    alignItems: 'center' as const,
    gap: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 500,
    color: 'var(--chat-text-secondary)',
    padding: '8px 0',
    userSelect: 'none' as const,
  },
  testResult: {
    marginTop: '12px',
    padding: '10px 14px',
    borderRadius: '8px',
    fontSize: '13px',
  },
  switcherContainer: {
    display: 'inline-flex' as const,
    alignItems: 'center' as const,
    gap: '8px',
    position: 'relative' as const,
  },
  switcherBtn: {
    display: 'inline-flex' as const,
    alignItems: 'center' as const,
    gap: '6px',
    padding: '6px 12px',
    border: '1px solid var(--chat-border)',
    borderRadius: '8px',
    fontSize: '13px',
    cursor: 'pointer',
    backgroundColor: 'var(--chat-bg-secondary)',
    color: 'var(--chat-text)',
    transition: 'all 0.15s ease',
    whiteSpace: 'nowrap' as const,
  },
  switcherDropdown: {
    position: 'absolute' as const,
    top: '100%',
    left: 0,
    marginTop: '4px',
    minWidth: '220px',
    backgroundColor: 'var(--chat-bg)',
    border: '1px solid var(--chat-border)',
    borderRadius: '10px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
    zIndex: 1000,
    overflow: 'hidden' as const,
  },
  switcherItem: {
    display: 'flex' as const,
    alignItems: 'center' as const,
    gap: '10px',
    padding: '10px 14px',
    cursor: 'pointer',
    fontSize: '13px',
    transition: 'background 0.1s ease',
    color: 'var(--chat-text)',
  },
  switcherItemActive: {
    backgroundColor: COLORS.primaryLight,
  },
  activeDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: COLORS.success,
    flexShrink: 0,
  },
};

export class ProviderPanel implements m.ClassComponent<ProviderPanelAttrs> {
  private providers: ProviderConfig[] = [];
  private templates: ProviderTemplate[] = [];
  private loading = true;
  private error: string | null = null;
  private success: string | null = null;
  private view_mode: 'list' | 'add' | 'edit' = 'list';
  private editingId: string | null = null;
  private form: FormState = createEmptyForm();
  private testingId: string | null = null;
  private testResult: {success: boolean; latencyMs?: number; error?: string} | null = null;
  private deleting: string | null = null;
  private backendUrl = '';
  private apiKey?: string;

  oninit(vnode: m.Vnode<ProviderPanelAttrs>) {
    this.backendUrl = vnode.attrs.backendUrl;
    this.apiKey = vnode.attrs.apiKey;
    this.loadData();
  }

  onupdate(vnode: m.Vnode<ProviderPanelAttrs>) {
    if (vnode.attrs.backendUrl !== this.backendUrl || vnode.attrs.apiKey !== this.apiKey) {
      this.backendUrl = vnode.attrs.backendUrl;
      this.apiKey = vnode.attrs.apiKey;
      this.loadData();
    }
  }

  private async loadData() {
    this.loading = true;
    this.error = null;
    m.redraw();

    try {
      const [providersRes, templatesRes] = await Promise.all([
        fetch(apiUrl(this.backendUrl, ''), {headers: buildHeaders(this.apiKey)}),
        fetch(apiUrl(this.backendUrl, '/templates'), {headers: buildHeaders(this.apiKey)}),
      ]);

      if (!providersRes.ok) throw new Error(`Failed to load providers: ${providersRes.status}`);
      if (!templatesRes.ok) throw new Error(`Failed to load templates: ${templatesRes.status}`);

      const providersData = await providersRes.json();
      const templatesData = await templatesRes.json();

      this.providers = providersData.providers || [];
      this.templates = templatesData.templates || [];
    } catch (e: unknown) {
      this.error = e instanceof Error ? e.message : 'Failed to load provider data';
    } finally {
      this.loading = false;
      m.redraw();
    }
  }

  private async activateProvider(id: string) {
    try {
      const res = await fetch(apiUrl(this.backendUrl, `/${id}/activate`), {
        method: 'POST',
        headers: buildHeaders(this.apiKey),
      });
      if (!res.ok) throw new Error(`Activation failed: ${res.status}`);
      this.success = 'Provider activated successfully';
      await this.loadData();
      this.clearSuccessAfterDelay();
    } catch (e: unknown) {
      this.error = e instanceof Error ? e.message : 'Activation failed';
      m.redraw();
    }
  }

  private async deleteProvider(id: string) {
    this.deleting = id;
    m.redraw();

    try {
      const res = await fetch(apiUrl(this.backendUrl, `/${id}`), {
        method: 'DELETE',
        headers: buildHeaders(this.apiKey),
      });
      if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
      this.success = 'Provider deleted';
      this.deleting = null;
      await this.loadData();
      this.clearSuccessAfterDelay();
    } catch (e: unknown) {
      this.error = e instanceof Error ? e.message : 'Delete failed';
      this.deleting = null;
      m.redraw();
    }
  }

  private async testConnection(id: string) {
    this.testingId = id;
    this.testResult = null;
    m.redraw();

    try {
      const res = await fetch(apiUrl(this.backendUrl, `/${id}/test`), {
        method: 'POST',
        headers: buildHeaders(this.apiKey),
      });
      const data = await res.json();
      const result = data.result || data;
      this.testResult = {
        success: result.success,
        latencyMs: result.latencyMs,
        error: result.error,
      };
    } catch (e: unknown) {
      this.testResult = {
        success: false,
        error: e instanceof Error ? e.message : 'Connection test failed',
      };
    } finally {
      this.testingId = null;
      m.redraw();
    }
  }

  private async saveProvider() {
    const template = this.templates.find((t) => t.type === this.form.type);
    const body: Record<string, unknown> = {
      name: this.form.name,
      type: this.form.type,
      models: {
        primary: this.form.models.primary || template?.defaultModels.primary || '',
        light: this.form.models.light || template?.defaultModels.light || '',
        ...(this.form.models.subAgent ? {subAgent: this.form.models.subAgent} : {}),
      },
      connection: this.form.connection,
    };

    if (this.form.showTuning && Object.keys(this.form.tuning).length > 0) {
      body.tuning = this.form.tuning;
    }

    try {
      let res: Response;
      if (this.view_mode === 'edit' && this.editingId) {
        res = await fetch(apiUrl(this.backendUrl, `/${this.editingId}`), {
          method: 'PATCH',
          headers: buildHeaders(this.apiKey),
          body: JSON.stringify(body),
        });
      } else {
        res = await fetch(apiUrl(this.backendUrl, ''), {
          method: 'POST',
          headers: buildHeaders(this.apiKey),
          body: JSON.stringify(body),
        });
      }

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error((errData as {error?: string}).error || `Save failed: ${res.status}`);
      }

      this.success = this.view_mode === 'edit' ? 'Provider updated' : 'Provider created';
      this.view_mode = 'list';
      this.editingId = null;
      this.form = createEmptyForm();
      await this.loadData();
      this.clearSuccessAfterDelay();
    } catch (e: unknown) {
      this.error = e instanceof Error ? e.message : 'Save failed';
      m.redraw();
    }
  }

  private startEdit(provider: ProviderConfig) {
    this.view_mode = 'edit';
    this.editingId = provider.id;
    this.form = {
      name: provider.name,
      type: provider.type,
      models: {...provider.models},
      connection: {...provider.connection},
      tuning: provider.tuning ? {...provider.tuning} : {},
      showTuning: !!provider.tuning && Object.keys(provider.tuning).length > 0,
    };
    this.error = null;
    this.success = null;
    this.testResult = null;
    m.redraw();
  }

  private startAdd() {
    this.view_mode = 'add';
    this.editingId = null;
    this.form = createEmptyForm();
    this.error = null;
    this.success = null;
    this.testResult = null;

    const firstTemplate = this.templates[0];
    if (firstTemplate) {
      this.form.type = firstTemplate.type;
      this.form.models = {...firstTemplate.defaultModels};
    }
    m.redraw();
  }

  private cancelForm() {
    this.view_mode = 'list';
    this.editingId = null;
    this.form = createEmptyForm();
    this.error = null;
    this.testResult = null;
  }

  private clearSuccessAfterDelay() {
    setTimeout(() => {
      this.success = null;
      m.redraw();
    }, 3000);
  }

  private onTypeChange(type: ProviderType) {
    this.form.type = type;
    const template = this.templates.find((t) => t.type === type);
    if (template) {
      this.form.models = {...template.defaultModels};
      this.form.connection = {};
    }
  }

  view(_vnode: m.Vnode<ProviderPanelAttrs>): m.Children {
    if (this.view_mode === 'add' || this.view_mode === 'edit') {
      return this.renderForm();
    }
    return this.renderList();
  }

  private renderList(): m.Children {
    return m('div', {style: STYLES.container}, [
      this.error ? m('div', {style: STYLES.errorBanner}, [
        m('span', '⚠️'),
        m('span', this.error),
      ]) : null,
      this.success ? m('div', {style: STYLES.successBanner}, [
        m('span', '✅'),
        m('span', this.success),
      ]) : null,

      m('div', {style: STYLES.header}, [
        m('div', [
          m('h3', {style: STYLES.title}, 'Provider Management'),
          m('p', {style: STYLES.subtitle}, 'Configure and switch between AI providers'),
        ]),
        m('button', {
          style: STYLES.addBtn,
          onclick: () => this.startAdd(),
        }, '+ Add Provider'),
      ]),

      this.loading
        ? m('div', {style: STYLES.loadingState}, [
            m('span', '⏳'),
            'Loading providers...',
          ])
        : this.providers.length === 0
          ? this.renderEmpty()
          : this.renderGrid(),

      this.renderTestResult(),
    ]);
  }

  private renderEmpty(): m.Children {
    return m('div', {style: STYLES.emptyState}, [
      m('div', {style: STYLES.emptyIcon}, '\u{1F50C}'),
      m('h4', {style: {margin: '0 0 8px', color: 'var(--chat-text)'}}, 'No providers configured'),
      m('p', {style: {margin: 0, fontSize: '14px'}}, 'Add a provider to start using AI analysis'),
      m('button', {
        style: {...STYLES.btn, ...STYLES.btnPrimary, marginTop: '16px'},
        onclick: () => this.startAdd(),
      }, '+ Add Your First Provider'),
    ]);
  }

  private renderGrid(): m.Children {
    return m('div', {style: STYLES.grid},
      this.providers.map((p) => this.renderCard(p)),
    );
  }

  private renderCard(provider: ProviderConfig): m.Children {
    const isActive = provider.isActive;
    const cardStyle = {
      ...STYLES.card,
      ...(isActive ? STYLES.cardActive : {}),
    };

    return m('div', {style: cardStyle, key: provider.id}, [
      m('div', {style: STYLES.cardHeader}, [
        m('div', {style: STYLES.cardIcon}, TYPE_ICONS[provider.type] || '\u{1F527}'),
        m('div', {style: {flex: 1, minWidth: 0}}, [
          m('div', {style: STYLES.cardName}, provider.name),
          m('div', {style: {display: 'flex', gap: '6px', marginTop: '4px', flexWrap: 'wrap' as const}}, [
            isActive
              ? m('span', {style: {...STYLES.cardBadge, ...STYLES.activeBadge}}, [
                  m('span', {style: {width: '6px', height: '6px', borderRadius: '50%', backgroundColor: COLORS.success, display: 'inline-block'}}),
                  'Active',
                ])
              : null,
            m('span', {style: {...STYLES.cardBadge, ...STYLES.categoryBadge}},
              CATEGORY_LABELS[provider.category] || provider.category),
          ]),
        ]),
      ]),

      m('div', {style: STYLES.cardModels}, [
        m('div', `Primary: ${provider.models.primary}`),
        m('div', `Light: ${provider.models.light}`),
        provider.models.subAgent
          ? m('div', `Sub-agent: ${provider.models.subAgent}`)
          : null,
      ]),

      m('div', {style: STYLES.cardActions}, [
        !isActive
          ? m('button', {
              style: STYLES.actionBtn,
              onclick: () => this.activateProvider(provider.id),
              title: 'Activate',
            }, '⭐ Activate')
          : null,
        m('button', {
          style: STYLES.actionBtn,
          onclick: () => this.testConnection(provider.id),
          disabled: this.testingId === provider.id,
          title: 'Test Connection',
        }, this.testingId === provider.id ? '⏳' : '\u{1F50C} Test'),
        m('button', {
          style: STYLES.actionBtn,
          onclick: () => this.startEdit(provider),
          title: 'Edit',
        }, '✏️ Edit'),
        m('button', {
          style: {...STYLES.actionBtn, ...STYLES.actionBtnDanger},
          onclick: () => this.deleteProvider(provider.id),
          disabled: this.deleting === provider.id || isActive,
          title: isActive ? 'Cannot delete active provider' : 'Delete',
        }, this.deleting === provider.id ? '⏳' : '\u{1F5D1}️'),
      ]),
    ]);
  }

  private renderTestResult(): m.Children {
    if (!this.testResult) return null;

    const style = {
      ...STYLES.testResult,
      ...(this.testResult.success
        ? {backgroundColor: COLORS.successLight, color: COLORS.success, border: `1px solid ${COLORS.success}`}
        : {backgroundColor: COLORS.errorLight, color: COLORS.error, border: `1px solid ${COLORS.error}`}),
      marginTop: '16px',
    };

    return m('div', {style}, [
      this.testResult.success
        ? m('span', `✅ Connection successful${this.testResult.latencyMs ? ` (${this.testResult.latencyMs}ms)` : ''}`)
        : m('span', `❌ Connection failed: ${this.testResult.error || 'Unknown error'}`),
    ]);
  }

  private renderForm(): m.Children {
    const template = this.templates.find((t) => t.type === this.form.type);
    // requiredFields from API are "connection.apiKey" format — strip prefix
    const requiredFields = (template?.requiredFields || ['connection.apiKey'])
      .map((f) => f.replace(/^connection\./, ''));
    const isEdit = this.view_mode === 'edit';

    return m('div', {style: STYLES.container}, [
      this.error ? m('div', {style: STYLES.errorBanner}, [
        m('span', '⚠️'),
        m('span', this.error),
      ]) : null,

      m('div', {style: STYLES.header}, [
        m('div', [
          m('h3', {style: STYLES.title}, isEdit ? 'Edit Provider' : 'Add Provider'),
          m('p', {style: STYLES.subtitle}, isEdit ? 'Modify provider configuration' : 'Configure a new AI provider'),
        ]),
      ]),

      m('div', {style: STYLES.form}, [
        // Type selector
        m('div', {style: STYLES.formSection}, [
          m('h4', {style: STYLES.formSectionTitle}, 'Provider Type'),
          m('div', {style: STYLES.formField}, [
            m('select', {
              style: STYLES.formSelect,
              value: this.form.type,
              onchange: (e: Event) => this.onTypeChange((e.target as HTMLSelectElement).value as ProviderType),
              disabled: isEdit,
            },
              this.templates.map((t) =>
                m('option', {value: t.type}, `${TYPE_ICONS[t.type]} ${t.displayName}`),
              ),
            ),
          ]),
        ]),

        // Name
        m('div', {style: STYLES.formSection}, [
          m('h4', {style: STYLES.formSectionTitle}, 'Name'),
          m('div', {style: STYLES.formField}, [
            m('input[type=text]', {
              style: STYLES.formInput,
              value: this.form.name,
              oninput: (e: Event) => {
                this.form.name = (e.target as HTMLInputElement).value;
              },
              placeholder: `My ${template?.displayName || 'Provider'}`,
            }),
          ]),
        ]),

        // Connection
        m('div', {style: STYLES.formSection}, [
          m('h4', {style: STYLES.formSectionTitle}, 'Connection'),
          ...requiredFields.map((field) => {
            const meta = CONNECTION_FIELD_LABELS[field] || {
              label: field,
              type: 'text',
              placeholder: '',
            };
            return m('div', {style: STYLES.formField}, [
              m('label', {style: STYLES.formLabel}, meta.label),
              m(`input[type=${meta.type}]`, {
                style: STYLES.formInput,
                value: (this.form.connection as Record<string, string>)[field] || '',
                oninput: (e: Event) => {
                  (this.form.connection as Record<string, string>)[field] =
                    (e.target as HTMLInputElement).value;
                },
                placeholder: meta.placeholder,
              }),
            ]);
          }),
        ]),

        // Models
        m('div', {style: STYLES.formSection}, [
          m('h4', {style: STYLES.formSectionTitle}, 'Models'),
          m('div', {style: STYLES.formField}, [
            m('label', {style: STYLES.formLabel}, 'Primary Model'),
            template?.availableModels && template.availableModels.length > 0
              ? m('select', {
                  style: STYLES.formSelect,
                  value: this.form.models.primary,
                  onchange: (e: Event) => {
                    this.form.models.primary = (e.target as HTMLSelectElement).value;
                  },
                }, [
                  m('option', {value: ''}, '-- Select --'),
                  ...template.availableModels.map((mdl) =>
                    m('option', {value: mdl.id}, `${mdl.name} (${mdl.tier})`),
                  ),
                ])
              : m('input[type=text]', {
                  style: STYLES.formInput,
                  value: this.form.models.primary,
                  oninput: (e: Event) => {
                    this.form.models.primary = (e.target as HTMLInputElement).value;
                  },
                  placeholder: template?.defaultModels.primary || 'Model ID',
                }),
            template?.defaultModels.primary
              ? m('div', {style: STYLES.formHint}, `Default: ${template.defaultModels.primary}`)
              : null,
          ]),
          m('div', {style: STYLES.formField}, [
            m('label', {style: STYLES.formLabel}, 'Light Model'),
            template?.availableModels && template.availableModels.length > 0
              ? m('select', {
                  style: STYLES.formSelect,
                  value: this.form.models.light,
                  onchange: (e: Event) => {
                    this.form.models.light = (e.target as HTMLSelectElement).value;
                  },
                }, [
                  m('option', {value: ''}, '-- Select --'),
                  ...template.availableModels.map((mdl) =>
                    m('option', {value: mdl.id}, `${mdl.name} (${mdl.tier})`),
                  ),
                ])
              : m('input[type=text]', {
                  style: STYLES.formInput,
                  value: this.form.models.light,
                  oninput: (e: Event) => {
                    this.form.models.light = (e.target as HTMLInputElement).value;
                  },
                  placeholder: template?.defaultModels.light || 'Model ID',
                }),
            template?.defaultModels.light
              ? m('div', {style: STYLES.formHint}, `Default: ${template.defaultModels.light}`)
              : null,
          ]),
          m('div', {style: STYLES.formField}, [
            m('label', {style: STYLES.formLabel}, 'Sub-agent Model (optional)'),
            m('input[type=text]', {
              style: STYLES.formInput,
              value: this.form.models.subAgent || '',
              oninput: (e: Event) => {
                this.form.models.subAgent = (e.target as HTMLInputElement).value || undefined;
              },
              placeholder: 'Leave empty to inherit primary',
            }),
          ]),
        ]),

        // Tuning (collapsible)
        m('div', {style: STYLES.formSection}, [
          m('div', {
            style: STYLES.tuningToggle,
            onclick: () => {
              this.form.showTuning = !this.form.showTuning;
            },
          }, [
            m('span', this.form.showTuning ? '▼' : '▶'),
            'Advanced Tuning',
          ]),
          this.form.showTuning ? this.renderTuningFields() : null,
        ]),

        // Actions
        m('div', {style: STYLES.formActions}, [
          m('button', {
            style: {...STYLES.btn, ...STYLES.btnSecondary},
            onclick: () => this.cancelForm(),
          }, 'Cancel'),
          m('button', {
            style: {
              ...STYLES.btn,
              ...STYLES.btnPrimary,
              ...(!this.form.name ? STYLES.btnDisabled : {}),
            },
            onclick: () => this.saveProvider(),
            disabled: !this.form.name,
          }, isEdit ? 'Save Changes' : 'Create Provider'),
        ]),
      ]),
    ]);
  }

  private renderTuningFields(): m.Children {
    const tuning = this.form.tuning;

    const numField = (label: string, key: keyof ProviderTuning, placeholder: string) =>
      m('div', {style: STYLES.formField}, [
        m('label', {style: STYLES.formLabel}, label),
        m('input[type=number]', {
          style: STYLES.formInput,
          value: tuning[key] ?? '',
          oninput: (e: Event) => {
            const val = (e.target as HTMLInputElement).value;
            if (val === '') {
              delete tuning[key];
            } else {
              (tuning as Record<string, unknown>)[key] = Number(val);
            }
          },
          placeholder,
        }),
      ]);

    const boolField = (label: string, key: 'enableSubAgents' | 'enableVerification') =>
      m('div', {style: {...STYLES.formField, display: 'flex', alignItems: 'center', gap: '8px'}}, [
        m('input[type=checkbox]', {
          checked: tuning[key] ?? true,
          onchange: (e: Event) => {
            tuning[key] = (e.target as HTMLInputElement).checked;
          },
        }),
        m('label', {style: {...STYLES.formLabel, margin: 0}}, label),
      ]);

    return m('div', {style: {paddingLeft: '12px', borderLeft: '2px solid var(--chat-border)'}}, [
      numField('Max Turns', 'maxTurns', '30'),
      m('div', {style: STYLES.formField}, [
        m('label', {style: STYLES.formLabel}, 'Effort Level'),
        m('select', {
          style: STYLES.formSelect,
          value: tuning.effort || '',
          onchange: (e: Event) => {
            const val = (e.target as HTMLSelectElement).value;
            if (val) {
              tuning.effort = val;
            } else {
              delete tuning.effort;
            }
          },
        }, [
          m('option', {value: ''}, '-- Default --'),
          m('option', {value: 'low'}, 'Low'),
          m('option', {value: 'medium'}, 'Medium'),
          m('option', {value: 'high'}, 'High'),
        ]),
      ]),
      numField('Max Budget (USD)', 'maxBudgetUsd', '5'),
      numField('Full Per-turn Timeout (ms)', 'fullPerTurnMs', '60000'),
      numField('Quick Per-turn Timeout (ms)', 'quickPerTurnMs', '40000'),
      numField('Verifier Timeout (ms)', 'verifierTimeoutMs', '60000'),
      numField('Classifier Timeout (ms)', 'classifierTimeoutMs', '30000'),
      boolField('Enable Sub-agents', 'enableSubAgents'),
      boolField('Enable Verification', 'enableVerification'),
    ]);
  }
}

export class ProviderQuickSwitcher implements m.ClassComponent<ProviderQuickSwitcherAttrs> {
  private providers: ProviderConfig[] = [];
  private open = false;
  private loading = false;
  private backendUrl = '';
  private apiKey?: string;

  oninit(vnode: m.Vnode<ProviderQuickSwitcherAttrs>) {
    this.backendUrl = vnode.attrs.backendUrl;
    this.apiKey = vnode.attrs.apiKey;
    this.loadProviders();
  }

  onupdate(vnode: m.Vnode<ProviderQuickSwitcherAttrs>) {
    if (vnode.attrs.backendUrl !== this.backendUrl || vnode.attrs.apiKey !== this.apiKey) {
      this.backendUrl = vnode.attrs.backendUrl;
      this.apiKey = vnode.attrs.apiKey;
      this.loadProviders();
    }
  }

  private async loadProviders() {
    this.loading = true;
    try {
      const res = await fetch(apiUrl(this.backendUrl, ''), {
        headers: buildHeaders(this.apiKey),
      });
      if (res.ok) {
        const data = await res.json();
        this.providers = data.providers || [];
      }
    } catch {
      // Silent fail for switcher
    } finally {
      this.loading = false;
      m.redraw();
    }
  }

  private async activate(id: string) {
    try {
      const res = await fetch(apiUrl(this.backendUrl, `/${id}/activate`), {
        method: 'POST',
        headers: buildHeaders(this.apiKey),
      });
      if (res.ok) {
        await this.loadProviders();
      }
    } catch {
      // Silent fail
    }
    this.open = false;
    m.redraw();
  }

  view(_vnode: m.Vnode<ProviderQuickSwitcherAttrs>): m.Children {
    const active = this.providers.find((p) => p.isActive);

    if (this.loading && this.providers.length === 0) {
      return m('div', {style: STYLES.switcherContainer}, [
        m('span', {style: {fontSize: '12px', color: 'var(--chat-text-secondary)'}}, '⏳'),
      ]);
    }

    if (this.providers.length === 0) {
      return null;
    }

    return m('div', {style: STYLES.switcherContainer}, [
      m('button', {
        style: STYLES.switcherBtn,
        onclick: (e: Event) => {
          e.stopPropagation();
          this.open = !this.open;
        },
      }, [
        m('span', TYPE_ICONS[active?.type || 'custom']),
        m('span', {style: {maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis'}},
          active?.name || 'No provider'),
        m('span', {style: {fontSize: '10px', opacity: 0.6}}, this.open ? '▲' : '▼'),
      ]),

      this.open ? this.renderDropdown() : null,
    ]);
  }

  private renderDropdown(): m.Children {
    return m('div', {
      style: STYLES.switcherDropdown,
      onclick: (e: Event) => e.stopPropagation(),
    }, [
      ...this.providers.map((p) =>
        m('div', {
          style: {
            ...STYLES.switcherItem,
            ...(p.isActive ? STYLES.switcherItemActive : {}),
          },
          key: p.id,
          onclick: () => {
            if (!p.isActive) this.activate(p.id);
            else this.open = false;
          },
        }, [
          m('span', {style: {fontSize: '16px'}}, TYPE_ICONS[p.type]),
          m('div', {style: {flex: 1, minWidth: 0}}, [
            m('div', {style: {fontSize: '13px', fontWeight: 500}}, p.name),
            m('div', {style: {fontSize: '11px', color: 'var(--chat-text-secondary)', fontFamily: 'monospace'}},
              p.models.primary),
          ]),
          p.isActive ? m('div', {style: STYLES.activeDot}) : null,
        ]),
      ),
    ]);
  }

  onremove() {
    this.open = false;
  }
}
