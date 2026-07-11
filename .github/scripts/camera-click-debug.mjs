import { chromium } from 'playwright';
import fs from 'node:fs';

const browser=await chromium.launch({headless:true});
try{
  const page=await browser.newPage({viewport:{width:1440,height:900}});
  await page.goto('http://127.0.0.1:4173/annals.html#s=1234567',{waitUntil:'domcontentloaded',timeout:45_000});
  await page.waitForFunction(()=>Boolean(window.ANNALS_DEBUG?.prepareCameraAcceptanceTargets)&&window.ANNALS_GUARDS?.summary()?.boot?.ready===true,{timeout:45_000});
  const result=await page.evaluate(()=>{
    const prepared=ANNALS_DEBUG.prepareCameraAcceptanceTargets();
    const point=ANNALS_DEBUG.focusCameraAcceptanceTarget('trade');
    const event=new MouseEvent('click',{clientX:point.x,clientY:point.y,bubbles:true,cancelable:true,button:0});
    const roots=cameraFollowRoots().map(root=>({kind:root.userData.cameraFollow?.kind,id:root.userData.cameraFollow?.id,visible:root.visible,parentVisible:root.parent?.visible}));
    const nearby=cameraScreenSpaceFollow(event);
    const before=ANNALS_CAMERA.summary();
    const directResult=handlePick(event);
    const afterDirect=ANNALS_CAMERA.summary();
    setCameraMode('free');
    const dispatchResult=renderer.domElement.dispatchEvent(new MouseEvent('click',{clientX:point.x,clientY:point.y,bubbles:true,cancelable:true,button:0}));
    const afterDispatch=ANNALS_CAMERA.summary();
    return{prepared,point,roots,nearby,before,directResult,afterDirect,dispatchResult,afterDispatch,trades:economyState().trades.map(t=>({id:t.id,status:t.status,progress:t.progress}))};
  });
  fs.writeFileSync('camera-click-debug.json',`${JSON.stringify(result,null,2)}\n`);
  console.log('camera click diagnostic written');
}finally{await browser.close()}
