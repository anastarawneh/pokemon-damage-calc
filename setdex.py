 
# Python program to read
# json file
 
import json
 
# Opening JSON file
calc = open('calc.json')
 
# returns JSON object as 
# a dictionary
data = json.load(calc)

mon_store = {}
for trainer in data:
  for mon_name in data[trainer].keys():
    mon_name_actual = mon_name[:-2]
    if mon_name_actual not in mon_store:
      mon_store[mon_name_actual] = {}
    if trainer[-3:-1] == '00':
      mon_store[mon_name_actual][trainer[:-4] + ' (Trainer #' + trainer[-1:] + ' Mon #' + mon_name[-1:] + ')'] = data[trainer][mon_name]
    elif trainer[-3:-2] == '0':
      mon_store[mon_name_actual][trainer[:-4] + ' (Trainer #' + trainer[-2:] + ' Mon #' + mon_name[-1:] + ')'] = data[trainer][mon_name]
    else:
      mon_store[mon_name_actual][trainer[:-4] + ' (Trainer #' + trainer[-3:] + ' Mon #' + mon_name[-1:] + ')'] = data[trainer][mon_name]
json.dump(mon_store, open('setdex.json', 'w'), sort_keys=True, indent='\t', separators=(',', ': '))