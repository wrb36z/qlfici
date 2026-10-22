
import json
from pathlib import Path
from datetime import datetime, timezone

# Configuration JA Pléchâtel
CLUB_ID = "519202"
EQUIPE_ID = "2026_6255_SEM_1"

RACINE = Path(__file__).resolve().parent.parent
FICHIER = RACINE / "matchs.json"

def main():
    if not FICHIER.exists():
        raise FileNotFoundError("matchs.json introuvable")

    with FICHIER.open("r", encoding="utf-8") as fichier:
        donnees = json.load(fichier)

    donnees["club"] = "JA Pléchâtel"
    donnees["equipe"] = EQUIPE_ID

    # La connexion aux données FFF reste à configurer.
    # Ne pas inventer de rencontres ou de résultats.
    print("Configuration du club vérifiée.")
    print("Synchronisation FFF non encore disponible.")

if __name__ == "__main__":
    main()
