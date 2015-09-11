
def statFormula(iv, base, ev, level, nature, isHP=False):
    if isHP:
        c = level + 10
    else:
        c = 5
    return int( ((iv + 2*base + ev/4)*level/100 + c)*nature )

class Pokemon(object):
    labels = ["HP","Atk","Def","SpAtk","SpDef","Spd"]

    def __init__(self, level, base, IVs, EVs, nature):
        self.level = level
        self.base = base
        self.IVs = IVs
        self.EVs = EVs
        self.nature = nature
        self.stats = [statFormula(i, b, e, level, n, isHP=hp) \
                        for i,b,e,n,hp \
                        in zip(IVs, base, EVs, nature, [True]+[False]*5)]

class IVCalculator(object):
    def __init__(self, pokemon):
        self.pokemon = pokemon

    def bruteForce(self):
        predIvs = [[] for i in range(6)]
        p = self.pokemon
        for i,stat in enumerate(p.stats):
            for iv in range(32):
                if stat == statFormula(iv, p.base[i], p.EVs[i], p.level, p.nature[i], isHP=i==0):
                    predIvs[i].append(iv)
        return predIvs

    def estimate(self):
        ests = [[] for i in range(6)]
        C = [self.pokemon.level + 10] + [5]*5
        p = self.pokemon
        L = p.level
        for i,(c,N,s,e,b) in enumerate(zip(C, p.nature, p.stats, p.EVs, p.base)):
            est = lambda e1, e2: (100.0/L) * ( (s+e2)/N + e1 - c) - 2*b - int(e/4)
            if N == 1.0:
                lower = est(0,0)
                upper = est(0.99,0)
                print lower,upper
            else:
                lower = est(0,0)
                upper = est(0.99,0.9)
            l,u = int(1+lower), int(upper)
            ests[i].extend(I for I in range(l,u+1) if N==1.0 or s==statFormula(I, b, e, L, N, isHP=i==0))
        return ests

if __name__ == "__main__":
    from pprint import pprint

    base = [108, 130, 95, 80, 85, 102]
    ivs = [24, 12, 30, 16, 23, 5]
    evs = [74, 195, 86, 48, 84, 23]
    nature = [1.0, 1.1, 1.0, 0.9, 1.0, 1.0]
    stats = [289, 279, 192, 135, 171, 171]
    level = 78
    garchomp = Pokemon(level, base, ivs, evs, nature)
    calc = IVCalculator(garchomp)
    bfs = calc.bruteForce()
    ivlbs = calc.estimate()
    print garchomp.stats
    print '{:<4}{:<5}{:<9}{}'.format('n','IVs','IVLBs','BFs')
    for n,iv,ivlb,bf in zip(garchomp.nature, garchomp.IVs, ivlbs, bfs):
        print '{:<4}{:<5}{:<9}{}'.format(n,iv,ivlb,bf)
