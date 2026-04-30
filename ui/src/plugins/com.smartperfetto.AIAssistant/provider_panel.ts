// SPDX-License-Identifier: AGPL-3.0-or-later

import m from 'mithril';

import {
  ProviderConfig,
  ProviderTemplate,
  ProviderPanelAttrs,
  TYPE_ICONS,
  CATEGORY_LABELS,
  buildHeaders,
  apiUrl,
} from './provider_types';
import {getTokens, STYLES as getStyles} from './provider_styles';
import {ProviderForm} from './provider_form';

export {ProviderPanelAttrs};

export class ProviderPanel implements m.ClassComponent<ProviderPanelAttrs> {
  private providers: ProviderConfig[] = [];
  private templates: ProviderTemplate[] = [];
  private loading = true;
  private error: string | null = null;
  private success: string | null = null;
  private view_mode: 'list' | 'add' | 'edit' = 'list';
  private editingId: string | null = null;
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

  private startEdit(provider: ProviderConfig) {
    this.view_mode = 'edit';
    this.editingId = provider.id;
    this.error = null;
    this.success = null;
    this.testResult = null;
    m.redraw();
  }

  private startAdd() {
    this.view_mode = 'add';
    this.editingId = null;
    this.error = null;
    this.success = null;
    this.testResult = null;
    m.redraw();
  }

  private clearSuccessAfterDelay() {
    setTimeout(() => {
      this.success = null;
      m.redraw();
    }, 3000);
  }

  view(_vnode: m.Vnode<ProviderPanelAttrs>): m.Children {
    if (this.view_mode === 'add' || this.view_mode === 'edit') {
      const editProvider = this.view_mode === 'edit'
        ? this.providers.find((p) => p.id === this.editingId)
        : undefined;
      return m(ProviderForm, {
        backendUrl: this.backendUrl,
        apiKey: this.apiKey,
        editingProvider: editProvider,
        templates: this.templates,
        onSaved: () => {
          this.success = this.view_mode === 'edit' ? 'Provider updated' : 'Provider created';
          this.view_mode = 'list';
          this.editingId = null;
          this.loadData();
          this.clearSuccessAfterDelay();
        },
        onCancel: () => {
          this.view_mode = 'list';
          this.editingId = null;
          this.error = null;
          this.testResult = null;
          m.redraw();
        },
      });
    }
    return this.renderList();
  }

  private renderList(): m.Children {
    const t = getTokens();
    const s = getStyles(t);
    return m('div', {style: s.container}, [
      this.error ? m('div', {style: s.errorBanner}, [
        m('span', '⚠️'),
        m('span', this.error),
      ]) : null,
      this.success ? m('div', {style: s.successBanner}, [
        m('span', '✅'),
        m('span', this.success),
      ]) : null,

      m('div', {style: s.header}, [
        m('div', [
          m('h3', {style: s.title}, 'Provider Management'),
          m('p', {style: s.subtitle}, 'Configure and switch between AI providers'),
        ]),
        m('button', {
          style: s.addBtn,
          onclick: () => this.startAdd(),
        }, '+ Add Provider'),
      ]),

      this.loading
        ? m('div', {style: s.loadingState}, [
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
    const t = getTokens();
    const s = getStyles(t);
    return m('div', {style: s.emptyState}, [
      m('div', {style: s.emptyIcon}, '\u{1F50C}'),
      m('h4', {style: {margin: '0 0 8px', color: t.text}}, 'No providers configured'),
      m('p', {style: {margin: 0, fontSize: '14px'}}, 'Add a provider to start using AI analysis'),
      m('button', {
        style: {...s.btn, ...s.btnPrimary, marginTop: '16px'},
        onclick: () => this.startAdd(),
      }, '+ Add Your First Provider'),
    ]);
  }

  private renderGrid(): m.Children {
    const t = getTokens();
    const s = getStyles(t);
    return m('div', {style: s.grid},
      this.providers.map((p) => this.renderCard(p)),
    );
  }

  private renderCard(provider: ProviderConfig): m.Children {
    const t = getTokens();
    const s = getStyles(t);
    const isActive = provider.isActive;
    const cardStyle = {
      ...s.card,
      ...(isActive ? s.cardActive : {}),
    };

    return m('div', {style: cardStyle, key: provider.id}, [
      m('div', {style: s.cardHeader}, [
        m('div', {style: s.cardIcon}, TYPE_ICONS[provider.type] || '\u{1F527}'),
        m('div', {style: {flex: 1, minWidth: 0}}, [
          m('div', {style: s.cardName}, provider.name),
          m('div', {style: {display: 'flex', gap: '6px', marginTop: '4px', flexWrap: 'wrap' as const}}, [
            isActive
              ? m('span', {style: {...s.cardBadge, ...s.activeBadge}}, [
                  m('span', {style: {width: '6px', height: '6px', borderRadius: '50%', backgroundColor: t.accent, display: 'inline-block'}}),
                  'Active',
                ])
              : null,
            m('span', {style: {...s.cardBadge, ...s.categoryBadge}},
              CATEGORY_LABELS[provider.category] || provider.category),
          ]),
        ]),
      ]),

      m('div', {style: s.cardModels}, [
        m('div', `Primary: ${provider.models.primary}`),
        m('div', `Light: ${provider.models.light}`),
        provider.models.subAgent
          ? m('div', `Sub-agent: ${provider.models.subAgent}`)
          : null,
      ]),

      m('div', {style: s.cardActions}, [
        !isActive
          ? m('button', {
              style: s.actionBtn,
              onclick: () => this.activateProvider(provider.id),
              title: 'Activate',
            }, '⭐ Activate')
          : null,
        m('button', {
          style: s.actionBtn,
          onclick: () => this.testConnection(provider.id),
          disabled: this.testingId === provider.id,
          title: 'Test Connection',
        }, this.testingId === provider.id ? '⏳' : '\u{1F50C} Test'),
        m('button', {
          style: s.actionBtn,
          onclick: () => this.startEdit(provider),
          title: 'Edit',
        }, '✏️ Edit'),
        m('button', {
          style: {...s.actionBtn, ...s.actionBtnDanger},
          onclick: () => this.deleteProvider(provider.id),
          disabled: this.deleting === provider.id || isActive,
          title: isActive ? 'Cannot delete active provider' : 'Delete',
        }, this.deleting === provider.id ? '⏳' : '\u{1F5D1}️'),
      ]),
    ]);
  }

  private renderTestResult(): m.Children {
    if (!this.testResult) return null;

    const t = getTokens();
    const s = getStyles(t);
    const style = {
      ...s.testResult,
      ...(this.testResult.success
        ? {backgroundColor: `${t.success}15`, color: t.success, border: `1px solid ${t.success}`}
        : {backgroundColor: `${t.error}15`, color: t.error, border: `1px solid ${t.error}`}),
      marginTop: '16px',
    };

    return m('div', {style}, [
      this.testResult.success
        ? m('span', `✅ Connection successful${this.testResult.latencyMs ? ` (${this.testResult.latencyMs}ms)` : ''}`)
        : m('span', `❌ Connection failed: ${this.testResult.error || 'Unknown error'}`),
    ]);
  }
}

