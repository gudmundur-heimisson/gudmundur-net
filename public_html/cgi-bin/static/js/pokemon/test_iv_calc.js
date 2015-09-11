base = [108, 130, 95, 80, 85, 102];
ivs = [24, 12, 30, 16, 23, 5];
evs = [74, 195, 86, 48, 84, 23];
nature = [1.0, 1.1, 1.0, 0.9, 1.0, 1.0];
stats = [289, 279, 192, 135, 171, 171];
level = 78;
garchomp = new Pokemon(level, base, ivs, evs, nature);
ivsEst = estimateIVs(level, base, evs, nature, stats);