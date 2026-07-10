const economyBaseRunHeadless=runHeadless;
runHeadless=function(seed,days,opt={}){let result=economyBaseRunHeadless(seed,days,opt);initEconomy();result.economy=economySummary();return result};
if(typeof window!=='undefined'){window.ANNALS_DEBUG.runHeadless=runHeadless;window.ANNALS_DEBUG.economy=()=>economySummary()}
