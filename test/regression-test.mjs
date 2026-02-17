#!/usr/bin/env node
import { apiGet, apiPost, apiDelete, encId, runTest } from './test-utils.mjs';

const DIR = import.meta.dirname;

await runTest('usecase', DIR, async (ctx) => {
  let s = ctx.step('Create use case diagram');
  let diagramId;
  try {
    const res = await apiPost('/api/usecase/diagrams', { name: 'Test UseCase' });
    diagramId = res.data._id;
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }

  s = ctx.step('Create subject');
  let subjectId;
  try {
    const res = await apiPost('/api/usecase/subjects', { diagramId, name: 'System', x1: 150, y1: 30, x2: 450, y2: 350 });
    subjectId = res.data._id;
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }

  s = ctx.step('Create actor');
  let actorId;
  try {
    const res = await apiPost('/api/usecase/actors', { diagramId, name: 'User', x1: 30, y1: 120, x2: 100, y2: 200 });
    actorId = res.data._id;
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }

  s = ctx.step('Create use case (Login)');
  let uc1Id;
  try {
    const res = await apiPost('/api/usecase/use-cases', { diagramId, name: 'Login', x1: 220, y1: 80, x2: 380, y2: 140 });
    uc1Id = res.data._id;
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }

  s = ctx.step('Create use case (View Dashboard)');
  let uc2Id;
  try {
    const res = await apiPost('/api/usecase/use-cases', { diagramId, name: 'View Dashboard', x1: 220, y1: 200, x2: 380, y2: 260 });
    uc2Id = res.data._id;
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }

  s = ctx.step('Create association: Actor → Login');
  try {
    await apiPost('/api/usecase/associations', { diagramId, sourceId: actorId, targetId: uc1Id });
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }

  s = ctx.step('Create association: Actor → View Dashboard');
  try {
    await apiPost('/api/usecase/associations', { diagramId, sourceId: actorId, targetId: uc2Id });
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }

  s = ctx.step('Create include: View Dashboard → Login');
  try {
    await apiPost('/api/usecase/includes', { diagramId, sourceId: uc2Id, targetId: uc1Id });
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }

  await ctx.layoutDiagram(diagramId);
  await ctx.exportDiagram(diagramId, 'Export usecase image');

  s = ctx.step('Delete diagram');
  try {
    await apiDelete(`/api/usecase/diagrams/${encId(diagramId)}`);
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }
});
