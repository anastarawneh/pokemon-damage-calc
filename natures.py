import json

# Datei-Pfade
setdex_path = 'setdex.json'
exe_output_path = '05.11.2024.txt'
updated_setdex_path = 'updated_setdex.json'  # Ziel-Datei mit aktualisierten Wesen

# setdex.json laden
with open(setdex_path, encoding='utf8') as f:
    setdex_data = json.load(f)

# Funktion zum Laden der korrekten Wesen aus der `.exe`-Datei
def load_natures(file_path):
    natures = {}
    current_trainer = None
    with open(file_path, encoding='utf8') as f:
        for line in f:
            stripped_line = line.strip()
            if not stripped_line:
                continue
            # Prüfen, ob Zeile ein Trainer-Name ist
            if '=>' not in stripped_line:
                current_trainer = stripped_line
                natures[current_trainer] = []
            else:
                # Pokémon und Wesen extrahieren
                pokemon, nature = map(str.strip, stripped_line.split('=>'))
                natures[current_trainer].append((pokemon, nature))
    return natures

# Korrekte Wesen laden
exe_natures = load_natures(exe_output_path)

# Wesen in setdex.json aktualisieren
for pokemon_name, trainer_entries in setdex_data.items():
    for trainer_key, details in trainer_entries.items():
        # Extrahiere Trainer-Name und Pokémon
        trainer_name = trainer_key.split(' [#')[0]
        if trainer_name in exe_natures:
            # Suche das Pokémon in der Liste des Trainers
            trainer_nature_list = exe_natures[trainer_name]
            for mon_name, correct_nature in trainer_nature_list:
                # Wenn das Pokémon und Wesen übereinstimmen, ersetze "Serious"
                if mon_name == pokemon_name and details["nature"] == "Serious":
                    details["nature"] = correct_nature

# Speichern der aktualisierten Datei
with open(updated_setdex_path, 'w', encoding='utf8') as f:
    json.dump(setdex_data, f, indent=2, ensure_ascii=False)

print("Die Datei wurde erfolgreich mit den korrekten Wesen aktualisiert und in updated_setdex.json gespeichert.")
