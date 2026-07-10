const memoryBaseTick=tick;
tick=function(){memoryBaseTick();if(clock.day%30===0)decayMemories()};
