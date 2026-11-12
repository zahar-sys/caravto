import {test} from 'node:test';
import assert from 'node:assert/strict';
import {expectedOrigin} from '../src/lib/origin.ts';
test('development follows the actual port when Next selects 3001',()=>{assert.equal(expectedOrigin('http://127.0.0.1:3001/api/orders','http://127.0.0.1:3000','development'),'http://127.0.0.1:3001')});
test('production stays pinned to configured origin',()=>{assert.equal(expectedOrigin('http://internal:3000/api/orders','https://service.example','production'),'https://service.example');assert.throws(()=>expectedOrigin('http://internal:3000',undefined,'production'))});
