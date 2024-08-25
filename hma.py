import json

def Reverse(lst):
    new_lst = lst[::-1]
    return new_lst

# Funktion zum Ersetzen von Farfetch'D durch Farfetch’d
def replace_farfetchd(data):
    if isinstance(data, dict):
        for key in list(data.keys()):
            new_key = key.replace("Farfetch'D", "Farfetch’d")
            if new_key != key:
                data[new_key] = data.pop(key)
            replace_farfetchd(data[new_key])
    elif isinstance(data, list):
        for index in range(len(data)):
            replace_farfetchd(data[index])

# Öffnen der JSON-Datei zum Schreiben
calc = open("calc.json", "w", encoding="utf8")

calc.write('{\n')
num = 0
for trainer_index in range(len(data.trainers.stats)):
    trainer_class = data.trainers.stats[trainer_index]["class"].replace("\pk\mn", "Pokémon").replace("\s", "-").title()
    trainer_type = data.trainers.stats[trainer_index].structType
    if num > 0:
        index_num = 1
        if num < 10:
            calc.write('\t"' + trainer_class + ' ' + data.trainers.stats[trainer_index].name.title() + '_00' + str(num) + '":{\n')
        elif num < 100:
            calc.write('\t"' + trainer_class + ' ' + data.trainers.stats[trainer_index].name.title() + '_0' + str(num) + '":{\n')
        else:
            calc.write('\t"' + trainer_class + ' ' + data.trainers.stats[trainer_index].name.title() + '_' + str(num) + '":{\n')
        for mon_info in data.trainers.stats[trainer_index].pokemon:
            calc.write('\t\t"' + mon_info.mon.title() + '_' + str(index_num) + '":{\n\t\t\t"ability":"' + data.pokemon.stats[mon_info.mon].ability1.title() + '",\n\t\t\t')
            if trainer_type in ["Items", "Both"] and mon_info.item.title() != '????????':
                calc.write('"item":"' + mon_info.item.title() + '",\n\t\t\t')
            scaledIV = str(round(mon_info.ivSpread * .12156))
            calc.write('"nature":"Serious",\n\t\t\t"ivs":{"hp":' + scaledIV + ', "at":' + scaledIV + ', "df":' + scaledIV + ', "sa":' + scaledIV + ', "sd":' + scaledIV + ', "sp":' + scaledIV + '}')
            moves = []
            calc.write(',\n\t\t\t"moves":')
            if trainer_type in ["Moves", "Both"]:
                moves.append(mon_info.move1.title())
                if mon_info.move2 != "-": moves.append(mon_info.move2.title())
                if mon_info.move3 != "-": moves.append(mon_info.move3.title())
                if mon_info.move4 != "-": moves.append(mon_info.move4.title())
            else:
                for movesFromLevel in Reverse(list(data.pokemon.moves.levelup[mon_info.mon].movesFromLevel)):
                    level = mon_info.level
                    if movesFromLevel.pair.level <= level:
                        moves.append(data.pokemon.moves.names[movesFromLevel.pair.move].name.title())
                        if len(moves) == 4: break
            calc.write(json.dumps(moves))
            calc.write(',\n\t\t\t"level":' + str(mon_info.level))
            if index_num < data.trainers.stats[trainer_index].pokemonCount: calc.write('\n\t\t},\n')
            else: calc.write('\n\t\t}\n')
            index_num = index_num + 1
        if num < 854: calc.write('\t},\n')
        else: calc.write('\t}\n')
    num = num + 1

calc.write('}')
calc.close()

# Ersetzen von 'Farfetch'D' durch 'Farfetch’d'
with open('calc.json', 'r', encoding='utf8') as file:
    data = json.load(file)

replace_farfetchd(data)

with open('calc.json', 'w', encoding='utf8') as file:
    json.dump(data, file, indent=4, ensure_ascii=False)