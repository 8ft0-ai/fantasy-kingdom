;function productUiSummary(){let e=economyState();return{tabs:['time','rates','acts','world','houses'],activeTab:world.productUiState?.tab||'time',acts:['grain','festival','drought','fire'],taxRate:e.taxRate,hotkeys:['Space','Digit1','Digit2','Digit3','Digit4','KeyH','KeyC','Escape'],inspectors:['settlement','building','character','scar','memory','dynasty','trade','army','bandit-camp','dragon'],copyLink:true,exportChronicle:true}}
if(typeof window!=='undefined'){window.ANNALS_DEBUG.productUiSummary=()=>productUiSummary()}
const productUiBaseRunHeadless=runHeadless;
runHeadless=function(seed,days,opt={}){let result=productUiBaseRunHeadless(seed,days,opt);result.productUi=productUiSummary();return result};
