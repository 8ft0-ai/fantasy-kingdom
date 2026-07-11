import { chromium } from 'playwright';
import fs from 'node:fs';

const baseUrl=(process.env.ANNALS_BASE_URL||'http://127.0.0.1:4173').replace(/\/$/,'');
const reportPath='performance-smoke-report.json';
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1440,height:900}});
const consoleErrors=[];
const pageErrors=[];
page.on('console',message=>{if(message.type()==='error')consoleErrors.push(message.text())});
page.on('pageerror',error=>pageErrors.push(error.message));
const report={passed:false,url:`${baseUrl}/annals.html#s=1234567&debug=1`};
try{
  await page.goto(report.url,{waitUntil:'domcontentloaded',timeout:45000});
  await page.waitForFunction(()=>Boolean(window.ANNALS_PERFORMANCE&&window.ANNALS_DEBUG?.renderingSummary),{timeout:45000});
  await page.waitForFunction(()=>document.querySelector('canvas')&&document.querySelectorAll('.entry').length>0,{timeout:30000});
  await page.waitForTimeout(2200);
  await page.evaluate(()=>{window.ANNALS_OVERLAYS?.set('none');window.ANNALS_PERFORMANCE.setQuality('minimal',true,'performance smoke')});
  await page.waitForTimeout(1400);
  const baseline=await page.evaluate(()=>({performance:window.ANNALS_PERFORMANCE.summary(),rendering:window.ANNALS_DEBUG.renderingSummary(),meterVisible:getComputedStyle(document.getElementById('performance-meter')).display!=='none',safeSeed:window.ANNALS_RECOVERY?.safeSeed}));
  await page.evaluate(async()=>{for(let i=0;i<3;i++){for(const quality of ['low','balanced','minimal']){window.ANNALS_PERFORMANCE.setQuality(quality,true,'cycle test');for(const overlay of ['territories','trade','terrain','none']){window.ANNALS_OVERLAYS.set(overlay);await new Promise(resolve=>setTimeout(resolve,70))}}}window.ANNALS_PERFORMANCE.setQuality('minimal',true,'final smoke state');window.ANNALS_OVERLAYS.set('none')});
  await page.waitForTimeout(1400);
  const final=await page.evaluate(()=>({performance:window.ANNALS_PERFORMANCE.summary(),rendering:window.ANNALS_DEBUG.renderingSummary(),overlay:window.ANNALS_OVERLAYS.summary()}));
  const assertions=[];
  if(!Number.isFinite(final.performance.fps)||final.performance.fps<=0)assertions.push(`invalid fps ${final.performance.fps}`);
  if(!Number.isFinite(final.performance.frameMs)||final.performance.frameMs<=0)assertions.push(`invalid frame time ${final.performance.frameMs}`);
  if(final.performance.quality!=='minimal')assertions.push(`expected minimal quality, got ${final.performance.quality}`);
  if(final.performance.drawCalls>final.performance.budgets.drawCalls)assertions.push(`draw calls ${final.performance.drawCalls} exceed ${final.performance.budgets.drawCalls}`);
  if(final.performance.triangles>final.performance.budgets.triangles)assertions.push(`triangles ${final.performance.triangles} exceed ${final.performance.budgets.triangles}`);
  if(final.performance.sceneObjects>final.performance.budgets.sceneObjects)assertions.push(`scene objects ${final.performance.sceneObjects} exceed ${final.performance.budgets.sceneObjects}`);
  if(final.rendering.activeLights>final.performance.budgets.lights)assertions.push(`lights ${final.rendering.activeLights} exceed ${final.performance.budgets.lights}`);
  if(final.rendering.weatherParticles>final.performance.budgets.particles)assertions.push(`particles ${final.rendering.weatherParticles} exceed ${final.performance.budgets.particles}`);
  if(Math.abs(final.performance.sceneObjects-baseline.performance.sceneObjects)>80)assertions.push(`scene object drift ${baseline.performance.sceneObjects} -> ${final.performance.sceneObjects}`);
  if(final.overlay.active!=='none'||final.overlay.objects!==0)assertions.push(`overlay did not return to empty state: ${JSON.stringify(final.overlay)}`);
  if(!baseline.meterVisible)assertions.push('debug performance meter was not visible');
  if(baseline.safeSeed!=='1234567')assertions.push(`unexpected safe seed ${baseline.safeSeed}`);
  if(consoleErrors.length)assertions.push(`console errors: ${consoleErrors.join(' | ')}`);
  if(pageErrors.length)assertions.push(`page errors: ${pageErrors.join(' | ')}`);
  report.baseline=baseline;report.final=final;report.consoleErrors=consoleErrors;report.pageErrors=pageErrors;report.assertions=assertions;report.passed=assertions.length===0;
} catch(error){report.error=error.message;report.consoleErrors=consoleErrors;report.pageErrors=pageErrors}
finally{await browser.close();fs.writeFileSync(reportPath,`${JSON.stringify(report,null,2)}\n`)}
if(!report.passed){console.error(JSON.stringify(report,null,2));process.exit(1)}
console.log(JSON.stringify(report,null,2));