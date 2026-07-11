import { chromium } from 'playwright';
import fs from 'node:fs';

const baseUrl=(process.env.ANNALS_BASE_URL||'http://127.0.0.1:4173').replace(/\/$/,'');
const seeds=['1234567','987654','424242'];
const reportPath='camera-smoke-report.json';
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
      await page.waitForFunction(()=>Boolean(window.ANNALS_DEBUG?.runCameraAcceptance)&&window.ANNALS_GUARDS?.summary()?.boot?.ready===true,{timeout:45_000});
      const prepared=await page.evaluate(()=>window.ANNALS_DEBUG.prepareCameraAcceptanceTargets());
      result.prepared=prepared;
      result.clicks={};
      for(const kind of ['trade','army','dragon']){
        const clicked=await page.evaluate(value=>{
          const point=window.ANNALS_DEBUG.focusCameraAcceptanceTarget(value);
          if(!point||!Number.isFinite(point.x)||!Number.isFinite(point.y))return{point,follow:null};
          renderer.domElement.dispatchEvent(new MouseEvent('click',{clientX:point.x,clientY:point.y,bubbles:true,cancelable:true,button:0}));
          return{point,follow:window.ANNALS_CAMERA.summary()};
        },kind);
        result.clicks[kind]=clicked;
        if(!clicked.point||!Number.isFinite(clicked.point.x)||!Number.isFinite(clicked.point.y)){result.failures.push(`no screen target for ${kind}`);continue}
        if(clicked.follow?.mode!=='follow'||clicked.follow?.follow?.kind!==kind)result.failures.push(`click did not follow ${kind}`);
      }
      const canvas=page.locator('#app canvas');
      const box=await canvas.boundingBox();
      if(!box)throw new Error('renderer canvas was not available');
      await page.evaluate(()=>{setCameraMode('free');syncCameraOrbit()});
      const before=await page.evaluate(()=>({yaw:completeCameraState().yaw,distance:completeCameraState().distance,target:{x:camera.userData.target.x,z:camera.userData.target.z},day:clock.day}));
      await page.mouse.move(box.x+box.width*.5,box.y+box.height*.5);
      await page.mouse.down({button:'left'});
      await page.mouse.move(box.x+box.width*.61,box.y+box.height*.57,{steps:8});
      await page.mouse.up({button:'left'});
      const afterOrbit=await page.evaluate(()=>({yaw:completeCameraState().yaw,mode:cinematicState().mode,manualUntil:cinematicState().manualUntil}));
      if(Math.abs(afterOrbit.yaw-before.yaw)<.05||afterOrbit.mode!=='free'||afterOrbit.manualUntil<=before.day)result.failures.push('pointer orbit did not suspend Director and change yaw');
      await page.keyboard.down('Shift');
      await page.mouse.move(box.x+box.width*.52,box.y+box.height*.52);
      await page.mouse.down({button:'left'});
      await page.mouse.move(box.x+box.width*.6,box.y+box.height*.46,{steps:8});
      await page.mouse.up({button:'left'});
      await page.keyboard.up('Shift');
      const afterPan=await page.evaluate(()=>({x:camera.userData.target.x,z:camera.userData.target.z}));
      if(Math.hypot(afterPan.x-before.target.x,afterPan.z-before.target.z)<10)result.failures.push('pointer pan did not move the camera target');
      const distanceBefore=await page.evaluate(()=>completeCameraState().distance);
      await page.mouse.move(box.x+box.width*.5,box.y+box.height*.5);
      await page.mouse.wheel(0,-420);
      const distanceAfter=await page.evaluate(()=>completeCameraState().distance);
      if(!(distanceAfter<distanceBefore))result.failures.push('wheel zoom did not move along the altitude path');
      const evidence=await page.evaluate(()=>window.ANNALS_DEBUG.runCameraAcceptance(4800));
      result.evidence=evidence;
      if(!evidence.passed)result.failures.push('camera acceptance did not pass');
      for(const [name,passed] of Object.entries(evidence.checks||{}))if(!passed)result.failures.push(`camera check failed: ${name}`);
      const ui=await page.evaluate(()=>{
        renderLowerThird();
        let drawer=document.getElementById('drawer'),chron=document.getElementById('chron'),speed=document.getElementById('speed'),chip=document.querySelector('.camera-watch'),beat=document.getElementById('cinematic-beat');
        return{
          watch:document.body.classList.contains('watch'),
          drawer:getComputedStyle(drawer).display,
          chron:getComputedStyle(chron).display,
          speed:getComputedStyle(speed).display,
          chip:chip?getComputedStyle(chip).display:null,
          lowerThird:!!beat,
          panel:typeof cameraCompletionPanel==='function'?cameraCompletionPanel():''
        }
      });
      result.ui=ui;
      if(!(ui.watch&&ui.drawer==='none'&&ui.chron==='none'&&ui.speed==='none'&&ui.chip!=='none'))result.failures.push('Watch mode did not reduce the UI to the cinematic HUD');
      if(!ui.lowerThird)result.failures.push('Watch mode lower third was not available');
      if(!ui.panel.includes('Drag to orbit')||!ui.panel.includes('Follow a notable')||!ui.panel.includes('Follow an incident'))result.failures.push('camera control surface was incomplete');
      if(consoleErrors.length)result.failures.push(`console errors: ${consoleErrors.join(' | ')}`);
      if(pageErrors.length)result.failures.push(`page errors: ${pageErrors.join(' | ')}`);
      result.passed=result.failures.length===0;
    }catch(error){result.error=error.message;result.consoleErrors=consoleErrors;result.pageErrors=pageErrors}
    finally{results.push(result);await page.close()}
  }
}finally{await browser.close()}
fs.writeFileSync(reportPath,`${JSON.stringify(results,null,2)}\n`);
const failures=results.filter(r=>!r.passed);
if(failures.length){console.error(JSON.stringify(failures,null,2));throw new Error(`${failures.length} camera acceptance case(s) failed`)}
console.log(JSON.stringify(results.map(r=>({seed:r.seed,shots:r.evidence.shotCount,types:r.evidence.types,categories:r.evidence.categories,minClearance:r.evidence.minTerrainClearance,lowValueMaxRepeat:r.evidence.lowValueMaxRepeat})),null,2));
