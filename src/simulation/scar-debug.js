const scarBaseRunHeadless=runHeadless;
runHeadless=function(seed,days,opt={}){let result=scarBaseRunHeadless(seed,days,opt);result.scars=scarState().registry.map(scarSummary);result.scarLimit=SCAR_LIMIT;result.scarStates=scarState().registry.reduce((a,s)=>(a[s.state]=(a[s.state]||0)+1,a),{});return result};
if(typeof window!=='undefined'){window.ANNALS_DEBUG.runHeadless=runHeadless;window.ANNALS_DEBUG.scars=()=>scarState().registry.map(scarSummary);window.ANNALS_DEBUG.scarLimit=SCAR_LIMIT}
