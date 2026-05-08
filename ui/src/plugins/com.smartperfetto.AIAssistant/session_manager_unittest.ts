// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2024-2026 Gracker (Chris)
// This file is part of SmartPerfetto. See LICENSE for details.

import {beforeEach, describe, expect, it} from '@jest/globals';

import {AISession, PENDING_BACKEND_TRACE_KEY, SESSIONS_KEY} from './types';
import {
  SessionManager,
  getPendingBackendTraceStorageKey,
} from './session_manager';

function makeSession(sessionId: string, fingerprint: string): AISession {
  return {
    sessionId,
    traceFingerprint: fingerprint,
    traceName: `${fingerprint}.perfetto-trace`,
    createdAt: Date.now(),
    lastActiveAt: Date.now(),
    messages: [],
    pinnedResults: [],
    bookmarks: [],
  };
}

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});

describe('SessionManager pending backend trace storage', () => {
  it('stores pending backend traces under a window-scoped sessionStorage key', () => {
    sessionStorage.setItem('smartperfetto-window-id', 'window-a');
    const manager = new SessionManager();

    manager.storePendingBackendTrace('trace-a', 9814);

    const key = getPendingBackendTraceStorageKey('window-a');
    expect(sessionStorage.getItem(key)).toContain('trace-a');
    expect(localStorage.getItem(PENDING_BACKEND_TRACE_KEY)).toBeNull();
    expect(manager.recoverPendingBackendTrace(9814)).toBe('trace-a');
    expect(sessionStorage.getItem(key)).toBeNull();
  });

  it('does not recover another window pending trace', () => {
    const manager = new SessionManager();
    sessionStorage.setItem(
      getPendingBackendTraceStorageKey('window-a'),
      JSON.stringify({traceId: 'trace-a', port: 9815, timestamp: Date.now()}),
    );
    sessionStorage.setItem('smartperfetto-window-id', 'window-b');

    expect(manager.recoverPendingBackendTrace(9815)).toBeNull();
    expect(sessionStorage.getItem(getPendingBackendTraceStorageKey('window-a'))).toContain('trace-a');
  });
});

describe('SessionManager session storage CAS', () => {
  it('merges stale read-modify-write saves instead of overwriting concurrent sessions', () => {
    const firstWindow = new SessionManager();
    const secondWindow = new SessionManager();

    const firstSnapshot = firstWindow.loadSessionsStorage();
    const secondSnapshot = secondWindow.loadSessionsStorage();

    firstSnapshot.byTrace['trace-a'] = [makeSession('session-a', 'trace-a')];
    firstWindow.saveSessionsStorage(firstSnapshot);

    secondSnapshot.byTrace['trace-b'] = [makeSession('session-b', 'trace-b')];
    secondWindow.saveSessionsStorage(secondSnapshot);

    const merged = new SessionManager().loadSessionsStorage();
    expect(merged.byTrace['trace-a'].map(s => s.sessionId)).toEqual(['session-a']);
    expect(merged.byTrace['trace-b'].map(s => s.sessionId)).toEqual(['session-b']);

    const raw = localStorage.getItem(SESSIONS_KEY);
    expect(raw).not.toBeNull();
    expect(JSON.parse(raw || '{}')._meta.revision).toBeGreaterThanOrEqual(2);
  });
});
