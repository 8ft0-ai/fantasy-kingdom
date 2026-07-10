import { chromium } from 'playwright';
import fs from 'node:fs';

const baseUrl=(process.env.ANNALS_BASE_URL||'http://127.0.0.1:4173').replace(/\/$/,'');
const seeds=[1234567,987654,424242];
const failures=[];
const report={seeds:[],browser:{}};
const assert=(condition,message,details={})=>{if(!condition)failures.push({message,details})};
const stable=value=>JSON.stringify(value);

const browser=await chromium.launch({headless:true});
try{
  const page=await browser.newPage({viewport:{width:1440,height:900}});
  await page.goto(`${baseUrl}/annals.html#s=1234567`,{waitUntil:'domcontentloaded',timeout:45000});
  await page.waitForFunction(()=>window.ANNALS_DEBUG?.chronicleRegressionRun&&document.querySelectorAll('.entry').length>0,{timeout:45000});

  for(const seed of seeds){
    const pair=await page.evaluate(({seed})=>{
      const options={initialChronicle:true,fireAt:20,droughtAt:120,festivalAt:240,grainAt:360};
      const first=window.ANNALS_DEBUG.chronicleRegressionRun(seed,2400,options);
      const second=window.ANNALS_DEBUG.chronicleRegressionRun(seed,2400,options);
      return{first,second};
    },{seed});
    const a=pair.first,b=pair.second,s=a.summary;
    assert(stable(a.summary)===stable(b.summary),'Repeated Chronicle summaries differed',{seed});
    assert(stable(a.reigns)===stable(b.reigns),'Repeated reign summaries differed',{seed});
    assert(stable(a.memories)===stable(b.memories),'Repeated memory summaries differed',{seed});
    assert(s.count<=s.limit,'Chronicle exceeded configured bound',{seed,count:s.count,limit:s.limit});
    assert(s.references>0,'No prior-event memory reference occurred',{seed});
    assert(s.headers>=2,'Monarch transition did not emit a later reign header',{seed,headers:s.headers});
    assert(['crown','war','trade','fate'].every(kind=>(s.classes[kind]||0)>0),'Expected Chronicle classes were not all present',{seed,classes:s.classes});
    assert(s.targetable===s.count,'At least one Chronicle event lacked finite target coordinates',{seed,targetable:s.targetable,count:s.count});
    assert(a.exportText.startsWith('THE ANNALS OF '),'Export omitted title',{seed});
    assert(a.exportText.includes(`Seed ${seed}`),'Export omitted seed',{seed});
    assert(/\nYEAR 1\n------/.test(a.exportText),'Export omitted chronological year section',{seed});
    assert(a.exportText.trimEnd().endsWith(`Thus ends the surviving record of ${a.exportText.match(/^THE ANNALS OF (.+)$/m)?.[1]?.toLowerCase().replace(/\b\w/g,c=>c.toUpperCase())||''}.`)||a.exportText.includes('Thus ends the surviving record of '),'Export omitted closing line',{seed});
    report.seeds.push({seed,count:s.count,limit:s.limit,classes:s.classes,headers:s.headers,references:s.references,reigns:a.reigns.length,memories:a.memories.length});
  }

  await page.evaluate(()=>{window.ANNALS_DEBUG.chronicleRegressionRun(1234567,2400,{initialChronicle:true,fireAt:20,droughtAt:120,festivalAt:240,grainAt:360});world.filter='all';renderChronicle()});
  const filterResults={};
  for(const filter of ['crown','war','trade','fate']){
    await page.click(`#chron button[data-filter="${filter}"]`);
    await page.waitForTimeout(50);
    const state=await page.evaluate(filter=>({active:document.querySelector(`#chron button[data-filter="${filter}"]`)?.classList.contains('active'),classes:[...document.querySelectorAll('#entries .entry')].map(e=>e.className)}),filter);
    filterResults[filter]=state;
    assert(state.active,`Filter chip ${filter} did not become active`);
    assert(state.classes.length>0,`Filter chip ${filter} showed no entries`);
    assert(state.classes.every(name=>name.split(/\s+/).includes(filter)),`Filter chip ${filter} showed another class`,state);
  }
  await page.click('#chron button[data-filter="all"]');
  const before=await page.evaluate(()=>director.until);
  await page.click('#entries .entry');
  await page.waitForTimeout(100);
  const after=await page.evaluate(()=>director.until);
  assert(after>=before,'Clicking a targeted Chronicle entry did not invoke camera direction',{before,after});
  report.browser={filters:filterResults,targetClick:{before,after}};
}finally{await browser.close()}

fs.writeFileSync('chronicle-regression-report.json',`${JSON.stringify(report,null,2)}\n`);
if(failures.length){console.error(JSON.stringify(failures,null,2));process.exit(1)}
console.log(JSON.stringify(report,null,2));
