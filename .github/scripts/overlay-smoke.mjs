import { chromium } from 'playwright';
import fs from 'node:fs';

const baseUrl=(process.env.ANNALS_BASE_URL||'http://127.0.0.1:4173').replace(/\/$/,'');
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1440,height:900}});
const consoleErrors=[];
const pageErrors=[];
page.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text())});
page.on('pageerror',e=>pageErrors.push(e.message));
const report={passed:false,overlays:[],consoleErrors,pageErrors};
try{
  await page.goto(`${baseUrl}/annals.html#s=1234567`,{waitUntil:'domcontentloaded',timeout:45000});
  await page.waitForFunction(()=>window.ANNALS_OVERLAYS&&document.querySelector('canvas')&&document.querySelectorAll('.entry').length>0,{timeout:45000});
  const rows=await page.evaluate(async()=>{
    const out=[];
    for(const type of ['territories','trade','prosperity','plague','unrest','terrain']){
      window.ANNALS_OVERLAYS.set(type);
      await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
      const summary=window.ANNALS_OVERLAYS.summary();
      const legend=document.getElementById('overlay-legend');
      out.push({type,active:summary.active,objects:summary.objects,visible:summary.visible,legendVisible:legend?getComputedStyle(legend).display!=='none':false,legendText:legend?.textContent||''});
    }
    window.ANNALS_OVERLAYS.set('none');
    return out;
  });
  report.overlays=rows;
  const failures=[];
  for(const row of rows){
    if(row.active!==row.type)failures.push(`${row.type}: active state was ${row.active}`);
    if(row.objects<1)failures.push(`${row.type}: rendered no overlay geometry`);
    if(!row.visible)failures.push(`${row.type}: overlay root was not visible at realm altitude`);
    if(!row.legendVisible||!row.legendText.toLowerCase().includes(row.type.slice(0,-1)))failures.push(`${row.type}: legend was missing or incorrect`);
  }
  if(consoleErrors.length)failures.push(`console errors: ${consoleErrors.join(' | ')}`);
  if(pageErrors.length)failures.push(`page errors: ${pageErrors.join(' | ')}`);
  report.failures=failures;
  report.passed=failures.length===0;
  await page.screenshot({path:'screenshots/overlay-smoke.png'});
}finally{
  await browser.close();
  fs.writeFileSync('overlay-smoke-report.json',`${JSON.stringify(report,null,2)}\n`);
}
if(!report.passed){console.error(JSON.stringify(report,null,2));process.exit(1)}
console.log(JSON.stringify(report,null,2));