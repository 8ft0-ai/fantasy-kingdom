import { chromium } from 'playwright';
import fs from 'node:fs';

const baseUrl=(process.env.ANNALS_BASE_URL||'http://127.0.0.1:4173').replace(/\/$/,'');
const seeds=['1234567','987654','424242'];
const reportPath='war-smoke-report.json';
const results=[];
const browser=await chromium.launch({headless:true});
try{
  for(const seed of seeds){
    const page=await browser.newPage({viewport:{width:1440,height:900}});
    const consoleErrors=[],pageErrors=[];
    page.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text())});
    page.on('pageerror',e=>pageErrors.push(e.message));
    const result={seed,passed:false,failures:[]};
    try{
      await page.goto(`${baseUrl}/annals.html#s=${seed}`,{waitUntil:'domcontentloaded',timeout:45_000});
      await page.waitForFunction(()=>Boolean(window.ANNALS_DEBUG?.runWarAcceptance)&&window.ANNALS_GUARDS?.summary()?.boot?.ready===true,{timeout:45_000});
      const ui=await page.evaluate(()=>{
        setDrawerTab('acts');
        const acts=document.getElementById('drawer').innerText;
        const campaign=startCivilWar();
        const rebel=campaign&&campaignArmy(campaign,campaign.armyIds.find(id=>campaignArmy(campaign,id)?.side==='rebel'));
        if(campaign&&rebel)startSiege(campaign,rebel);
        updateWarMarkers();
        setDrawerTab('world');
        if(rebel)inspectArmy(rebel.id);
        return{
          acts,
          drawer:document.getElementById('drawer').innerText,
          inspector:document.getElementById('inspect').innerText,
          markerCount:typeof warMarkerGroup!=='undefined'&&warMarkerGroup?warMarkerGroup.children.length:0,
          active:campaign?{status:campaign.status,allies:campaign.alliedHouseIds?.length||0,siegePhase:campaign.siege?.phase||null}:null,
        };
      });
      const evidence=await page.evaluate(seedValue=>window.ANNALS_DEBUG.runWarAcceptance(seedValue),seed);
      const failures=result.failures;
      if(!evidence.passed)failures.push('war acceptance did not pass');
      for(const [name,passed] of Object.entries(evidence.checks||{}))if(!passed)failures.push(`war check failed: ${name}`);
      const nd=evidence.newDynasty,ex=evidence.exile,sq=evidence.statusQuo;
      if(JSON.stringify(nd?.battle?.phases)!==JSON.stringify(['skirmish','clash','rout']))failures.push('battle phases were incomplete');
      if(!(nd?.siege?.sorties>=1&&nd?.siege?.assaults>=1))failures.push('siege did not include sortie and assault');
      if(!nd?.battleScar?.name?.startsWith('Battle of '))failures.push('battlefield cairn lacked a battle name');
      if(nd?.outcome!=='new-dynasty'||ex?.outcome!=='exiled-house'||sq?.outcome!=='status-quo')failures.push('peace outcome matrix was incomplete');
      if(!(nd?.peace?.ownerChanges?.length>0&&ex?.peace?.ownerChanges?.length>0))failures.push('territory did not remain changed after decisive peace');
      if(!(nd?.ruinedDistricts?.some(r=>r.damagedLotIds.length>0)))failures.push('siege left no ruined district');
      if(!(nd?.allies?.length>0))failures.push('campaign had no allied participation');
      if(!(nd?.commanderOutcome||ex?.commanderOutcome||sq?.commanderOutcome))failures.push('war produced no commander death or epithet');
      if(!ui.acts.includes('Raise rival banners'))failures.push('Acts panel omitted civil-war action');
      if(!ui.drawer.includes('War and peace')||!ui.drawer.includes('War score')||!ui.drawer.includes('Exhaustion'))failures.push('World panel omitted completed war state');
      if(!ui.inspector.includes('Campaign state')||!ui.inspector.includes('Army exhaustion'))failures.push('army inspector omitted campaign state');
      if(ui.markerCount<4)failures.push(`war markers were incomplete: ${ui.markerCount}`);
      if(consoleErrors.length)failures.push(`console errors: ${consoleErrors.join(' | ')}`);
      if(pageErrors.length)failures.push(`page errors: ${pageErrors.join(' | ')}`);
      result.ui=ui;result.evidence=evidence;result.passed=failures.length===0;
    }catch(error){result.error=error.message;result.consoleErrors=consoleErrors;result.pageErrors=pageErrors}
    finally{results.push(result);await page.close()}
  }
}finally{await browser.close()}
fs.writeFileSync(reportPath,`${JSON.stringify(results,null,2)}\n`);
const failures=results.filter(r=>!r.passed);
if(failures.length){console.error(JSON.stringify(failures,null,2));throw new Error(`${failures.length} war acceptance case(s) failed`)}
console.log(JSON.stringify(results.map(r=>({seed:r.seed,newDynasty:r.evidence.newDynasty.outcome,exile:r.evidence.exile.outcome,statusQuo:r.evidence.statusQuo.outcome,allies:r.evidence.newDynasty.allies.length,sorties:r.evidence.newDynasty.siege.sorties,assaults:r.evidence.newDynasty.siege.assaults,ruinedDistricts:r.evidence.newDynasty.ruinedDistricts.length})),null,2));
