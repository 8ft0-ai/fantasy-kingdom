;const STABILITY_NARRATIVE_POLICIES={
  'food-shortage':{cooldown:120,startDay:1800},
  'market-shortage':{cooldown:180,startDay:1800},
  'character-status':{cooldown:240,startDay:360},
  birth:{cooldown:360,startDay:360},
  inheritance:{cooldown:360,startDay:360},
  'heir-birth':{cooldown:720,startDay:360},
  'alliance-birth':{cooldown:720,startDay:360},
  'marriage-alliance':{cooldown:720,startDay:360}
};
allowStabilityNarrative=function(type){let policy=STABILITY_NARRATIVE_POLICIES[type];if(!policy||clock.day<policy.startDay)return true;let state=stabilityState(),last=state.narrativeLast[type]??-Infinity;if(clock.day-last<policy.cooldown){state.suppressedNarrative[type]=(state.suppressedNarrative[type]||0)+1;return false}state.narrativeLast[type]=Math.floor(clock.day);return true};
eventChronicle=function(type,severity,location,text,details={}){if(allowStabilityNarrative(type))return stabilityBaseEventChronicle(type,severity,location,text,details);return emitWorldEvent(type,{severity,location,causes:details.causes||[],consequences:details.consequences||[],participants:details.participants||[],metadata:{...(details.metadata||{}),source:details.source||'simulation',director:false,suppressedChronicle:true,suppressedKind:details.kind||type}})};