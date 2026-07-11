;const annalsBaseMakeWorld=makeWorld;
makeWorld=function(seed){let candidate=annalsBaseMakeWorld(seed),rngSummary=assertRngStreams(seed),worldSummary=assertWorldShape(candidate);candidate.guardState={rng:rngSummary,world:worldSummary,boot:null};return candidate};
