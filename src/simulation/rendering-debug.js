;if(typeof window!=='undefined'){window.ANNALS_DEBUG.renderingSummary=()=>renderingSummary();window.ANNALS_DEBUG.lodBands={...LOD_BANDS}}
const renderingBaseRunHeadless=runHeadless;
runHeadless=function(seed,days,opt={}){let result=renderingBaseRunHeadless(seed,days,opt);result.rendering={bands:{...LOD_BANDS},lightLimit:AMBIENT_LIGHT_LIMIT,particleLimit:AMBIENT_PARTICLE_LIMIT,seasons:['Spring','Summer','Autumn','Winter'],weather:['Clear','Rain','Storm']};return result};
