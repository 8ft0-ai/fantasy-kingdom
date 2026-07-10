if(typeof window!=='undefined'){window.ANNALS_DEBUG.warSummary=()=>warSummary();window.ANNALS_DEBUG.warCampaignLimit=WAR_CAMPAIGN_LIMIT;window.ANNALS_DEBUG.armyLimit=ARMY_LIMIT;window.ANNALS_DEBUG.startCivilWar=()=>startCivilWar()}
const warBaseRunHeadless=runHeadless;
runHeadless=function(seed,days,opt={}){let result=warBaseRunHeadless(seed,days,opt);result.war=warSummary();return result};