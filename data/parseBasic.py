from pprint import pprint

with open('basic.txt', 'r') as infile:
    lines = infile.readlines()

lines = [line.strip() for line in lines]

numbers = []
names = []
types = []

for i, line in enumerate(lines):
    mod = i % 3
    if mod == 0:
        numbers.append(int(line[1:]))
    if mod == 1:
        names.append(line)
    if mod == 2:
        types.append(line.split(' '))

with open('basic.csv', 'w') as outfile:
    for number, name, types in zip(numbers, names, types):
        if len(types) == 1:
            types.append('')
        outfile.write(','.join([str(number), name] + types))
        outfile.write('\n')

print max(len(name) for name in names)