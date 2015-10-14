base = [108, 130, 95, 80, 85, 102];
ivs = [24, 12, 30, 16, 23, 5];
evs = [74, 195, 86, 48, 84, 23];
nature = NaturesMap.Adamant;
stats = [289, 279, 192, 135, 171, 171];
level = 78;
garchomp = new Pokemon(base, level, nature, null, stats, evs);
est = new IVEstimator(garchomp);
est.estimateAll();

