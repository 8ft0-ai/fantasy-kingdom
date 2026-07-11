import { chromium } from 'playwright';
import fs from 'node:fs';

const baseUrl=(process.env.ANNALS_BASE_URL||'http://127.0.0.1:4173').replace(/\/$/,'');
const seeds=['1234567','987654','424242'];
const reportPath='rendering-smoke-report.json';
const results=[];
const browser=await chromium.launch({headless:true});
try{
  for(const seed of seeds){
    const page=await browser.newPage({viewport:{width:1440,height:900}});
    const consoleErrors=[],pageErrors=[];
    page.on('console',message=>{if(message.type()==='error')consoleErrors.push(message.text())});
    page.on('pageerror',error=>pageErrors.push(error.message));
    const result={seed,passed:false,failures:[]};
    try{
      await page.goto(`${baseUrl}/annals.html#s=${seed}`,{waitUntil:'domcontentloaded',timeout:45_000});
      await page.waitForFunction(()=>Boolean(window.ANNALS_DEBUG?.runRenderingAcceptance)&&window.ANNALS_GUARDS?.summary()?.boot?.ready===true,{timeout:45_000});
      const evidence=await page.evaluate(()=>window.ANNALS_DEBUG.runRenderingAcceptance());
      result.evidence=evidence;
      if(!evidence.passed)result.failures.push('rendering acceptance did not pass');
      for(const [name,passed] of Object.entries(evidence.checks||{}))if(!passed)result.failures.push(`rendering check failed: ${name}`);
      if(consoleErrors.length)result.failures.push(`console errors: ${consoleErrors.join(' | ')}`);
      if(pageErrors.length)result.failures.push(`page errors: ${pageErrors.join(' | ')}`);
      result.passed=result.failures.length===0;
    }catch(error){result.error=error.message;result.consoleErrors=consoleErrors;result.pageErrors=pageErrors}
    finally{results.push(result);await page.close()}
  }
}finally{await browser.close()}
fs.writeFileSync(reportPath,`${JSON.stringify(results,null,2)}\n`);
const failures=results.filter(result=>!result.passed);
if(failures.length){console.error(JSON.stringify(failures,null,2));throw new Error(`${failures.length} rendering acceptance case(s) failed`)}
console.log(JSON.stringify(results.map(result=>({seed:result.seed,bands:Object.fromEntries(Object.entries(result.evidence.bands).map(([name,value])=>[name,value.objects])),seasons:result.evidence.seasons.map(value=>value.signature),weather:result.evidence.weather.map(value=>({visual:value.visual,units:value.units,maxLightning:value.maxLightning})),water:result.evidence.water,drawCalls:result.evidence.performance.drawCalls,sceneObjects:result.evidence.performance.sceneObjects})),null,2));
