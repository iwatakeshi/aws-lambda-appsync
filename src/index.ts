import 'isomorphic-fetch'
import ws = require('ws')
if (typeof WebSocket === 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (global as any).WebSocket = ws;
}

export * from './cognito'
export * from './iam'