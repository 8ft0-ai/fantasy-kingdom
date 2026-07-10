if(typeof window!=='undefined'){window.ANNALS_DEBUG.threatSummary=()=>threatSummary();window.ANNALS_DEBUG.setMythLevel=level=>setMythLevel(level);window.ANNALS_DEBUG.banditLimit=BANDIT_LIMIT}
const threatBaseRunHeadless=runHeadless;
runHeadless=function(seed,days,opt={}){let result=threatBaseRunHeadless(seed,days,opt);result.threats=threatSummary();return result};
