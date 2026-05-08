// Copyright (C) 2026 The Android Open Source Project
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {HttpRpcEngine} from './http_rpc_engine';

describe('HttpRpcEngine target selection', () => {
  beforeEach(() => {
    HttpRpcEngine.useDirectPort('9001');
  });

  it('uses direct port targets by default', () => {
    HttpRpcEngine.useDirectPort('9817');

    expect(HttpRpcEngine.getCurrentTarget()).toMatchObject({
      mode: 'direct-port',
      port: '9817',
      statusUrl: 'http://127.0.0.1:9817/status',
      websocketUrl: 'ws://127.0.0.1:9817/websocket',
    });
    expect(HttpRpcEngine.hostAndPort).toBe('127.0.0.1:9817');
  });

  it('uses backend lease proxy targets when configured', () => {
    HttpRpcEngine.setRpcTarget({
      mode: 'backend-lease-proxy',
      leaseId: 'lease-a',
      leaseMode: 'shared',
      leaseQueueLength: 4,
      statusUrl: 'http://backend/api/tp/lease-a/status',
      websocketUrl: 'ws://backend/api/tp/lease-a/websocket',
      displayName: 'backend shared lease lease-a',
    });

    expect(HttpRpcEngine.getCurrentTarget()).toMatchObject({
      mode: 'backend-lease-proxy',
      leaseId: 'lease-a',
      leaseMode: 'shared',
      leaseQueueLength: 4,
      statusUrl: 'http://backend/api/tp/lease-a/status',
      websocketUrl: 'ws://backend/api/tp/lease-a/websocket',
    });
    expect(HttpRpcEngine.hostAndPort).toBe('backend shared lease lease-a');
  });
});
