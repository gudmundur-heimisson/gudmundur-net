class Nature(object):
    def __init__(self, name, helpfulStat, hinderingStat):
        self.name = name
        self.helpful = helpfulStat
        self.hindering = hinderingStat

    def __str__(self):
        if self.helpful == self.hindering:
            return "{0.name}: Neutral".format(self)
        else:
            return "{0.name}: +{0.helpful} -{0.hindering}".format(self)

    def __repr__(self):
        return str(self)

names = [["Hardy","Lonely","Adamant","Naughty","Brave"],
                ["Bold","Docile","Impish","Lax","Relaxed"],
                ["Modest","Mild","Bashful","Rash","Quiet"],
                ["Calm","Gentle","Careful","Quirky","Sassy"],
                ["Timid", "Hasty", "Jolly","Naive","Serious"]]
stats = ["Attack", "Defense", "Sp. Atk", "Sp. Def", "Speed"]

natures = []
for i in range(5):
    for j in range(5):
        helpful, hindering = stats[i], stats[j]
        if helpful == hindering:
            helpful = hindering = None
        natures.append(Nature(names[i][j], helpful, hindering))
