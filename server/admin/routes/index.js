// Every API route, as [pattern, module]. Static patterns come before :id so /guests/bulk beats /guests/:id.
import * as r0 from './accommodation/route.js';
import * as r1 from './alerts/route.js';
import * as r2 from './checkin/route.js';
import * as r3 from './emergency/route.js';
import * as r4 from './events/route.js';
import * as r5 from './finance/categories/route.js';
import * as r6 from './finance/expenses/route.js';
import * as r7 from './guests/route.js';
import * as r8 from './guests/bulk/route.js';
import * as r9 from './guests/count/route.js';
import * as r10 from './invitation/route.js';
import * as r11 from './reports/route.js';
import * as r12 from './responsibilities/route.js';
import * as r13 from './rituals/route.js';
import * as r14 from './seed/route.js';
import * as r15 from './tasks/route.js';
import * as r16 from './travel/route.js';
import * as r17 from './vendors/route.js';
import * as r18 from './wedding/route.js';
import * as r19 from './whatsapp/route.js';
import * as r20 from './wipe/route.js';
import * as r21 from './accommodation/[id]/route.js';
import * as r22 from './alerts/[id]/route.js';
import * as r23 from './checkin/[id]/route.js';
import * as r24 from './emergency/[id]/route.js';
import * as r25 from './events/[id]/route.js';
import * as r26 from './finance/categories/[id]/route.js';
import * as r27 from './finance/expenses/[id]/route.js';
import * as r28 from './guests/[id]/route.js';
import * as r29 from './invitation/[id]/route.js';
import * as r30 from './responsibilities/[id]/route.js';
import * as r31 from './rituals/[id]/route.js';
import * as r32 from './tasks/[id]/route.js';
import * as r33 from './travel/[id]/route.js';
import * as r34 from './vendors/[id]/route.js';
import * as r35 from './whatsapp/[id]/route.js';
import * as r36 from './card-sync/route.js';

export const routes = [
  ['accommodation', r0],
  ['alerts', r1],
  ['checkin', r2],
  ['emergency', r3],
  ['events', r4],
  ['finance/categories', r5],
  ['finance/expenses', r6],
  ['guests', r7],
  ['guests/bulk', r8],
  ['guests/count', r9],
  ['invitation', r10],
  ['reports', r11],
  ['responsibilities', r12],
  ['rituals', r13],
  ['seed', r14],
  ['card-sync', r36],
  ['tasks', r15],
  ['travel', r16],
  ['vendors', r17],
  ['wedding', r18],
  ['whatsapp', r19],
  ['wipe', r20],
  ['accommodation/:id', r21],
  ['alerts/:id', r22],
  ['checkin/:id', r23],
  ['emergency/:id', r24],
  ['events/:id', r25],
  ['finance/categories/:id', r26],
  ['finance/expenses/:id', r27],
  ['guests/:id', r28],
  ['invitation/:id', r29],
  ['responsibilities/:id', r30],
  ['rituals/:id', r31],
  ['tasks/:id', r32],
  ['travel/:id', r33],
  ['vendors/:id', r34],
  ['whatsapp/:id', r35],
];
