// Items IDs must be between 101 and 999 (inclusive)
export const items = {
  "i101": {
    "id": 101,
    "name": "Crystal of Clarity",
    "type": "Healing",
    "affected": "hp",
    "effect": +20
  },
  "i999": {
    "id": 999,
    "name": "Excalibur",
    "type": "Weapon",
    "affected": "attack",
    "effect": 99
  }
}

// Enemies IDs must be between 1001 and 1999 (inclusive)
export const enemies = {
  "e1001": {
    "id": 1001,
    "name": "",
    "type": "Enemy",
    "level": 1,
    "mhp": 25,
    "hp": 25,
    "attack": 10,
    "loot": ""
  }
}

// Dialogues must be between 3001 and 3999 (inclusive)
export const dialogues = {
  "d3001": {
    "id": 3001,
    "name": "Tutorial 1",
    "type": "Dialogue",
    "content": {
      "0": {
        "character": "Alice",
        "characterid": 9001,
        "text": "Oh, hello there, little Muup! What brings you here today?",
        "triggers": []
      },
      "1": {
        "character": "Muup",
        "characterid": "player",
        "text": "I was just browsing on the Int... I mean, I was just strolling in the forst.",
        "triggers": []
      },
      "2": {
        "character": "Alice",
        "characterid": 9001,
        "text": "I see! In any case, you came at the right time! It looks like we have a bit of trouble in the forst.",
        "triggers": []

      },
      "3": {
        "character": "Muup",
        "characterid": "player",
        "text": "Oh... what happened? (Maybe I shouldn't have clicked on the Tutorial button).",
        "triggers": []

      },
      "4": {
        "character": "Alice",
        "characterid": 9001,
        "text": "Strange crystals with dark energy started appearing and they are corrupting the forest... oh, no!",
        "triggers": []
      },
      "5": {
        "character": "",
        "characterid": "voiceover",
        "text": "--A strange, dark crystal appeared next to Alice.--",
        "triggers": [
          {
            "type": "create",
            "coordinates": [5, 9],
            "objecttype": "enemy",
            "objectid": "e1001",
            "objectamount": 1
          }
        ]
      }
    }
  }
}

// NPC IDs must be between 9001 and 9999 (inclusive)
export const npcs = {
  "n9001": {
    "id": 9001,
    "name": "Alice",
    "type": "NPC",
    "level": 999,
    "mhp": 9999,
    "hp": 9999,
    "attack": 9999,
    "loot": "Caliburn"
  }
}
