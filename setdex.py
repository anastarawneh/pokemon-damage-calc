 
# Python program to read
# json file
 
import json
 
# Opening JSON file
calc = open('calc.json', encoding="utf8")
 
# returns JSON object as 
# a dictionary
data = json.load(calc)

# list of trainers numbers in game
number_of_ingame_trainers = [318]

mon_store = {}
party_order = {}
for trainer in data:
  trainer_num = int(trainer[-3:])
  trainer_name = trainer[:-4]
#sort out trainers who are duplicates
  if trainer_num not in number_of_ingame_trainers: continue
  final_party = []
  clean_party = [x[:-2] for x in data[trainer].keys()]
  for mon_name in clean_party:
    if len([x for x in clean_party if x == mon_name]) > 1:
      i = 1
      while f'{mon_name} ({i})' in final_party:
        i = i + 1
      final_party.append(f'{mon_name} ({i})')
    else: final_party.append(mon_name)
  party_order[trainer_name + f' [#{trainer_num}]'] = final_party
  
  for mon_name in final_party:
    mon_index = final_party.index(mon_name)
    dirty_mon_name = list(data[trainer].keys())[mon_index]
    mon_name_actual = mon_name.split(' (')[0]
    if mon_name_actual not in mon_store:
      mon_store[mon_name_actual] = {}
    if "(" in mon_name: mon_store[mon_name_actual][trainer_name + ' ' + mon_name.split(" ")[-1] + f' [#{trainer_num}]'] = data[trainer][dirty_mon_name]
    else: mon_store[mon_name_actual][trainer_name + f' [#{trainer_num}]'] = data[trainer][dirty_mon_name]

json.dump(mon_store, open('setdex.json', 'w', encoding="utf8"), sort_keys=True, indent='\t', separators=(',', ': '), ensure_ascii=False)
json.dump(party_order, open('party_order.json', 'w', encoding="utf8"), indent='\t', separators=(',', ': '), ensure_ascii=False)