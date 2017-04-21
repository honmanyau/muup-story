// Items IDs must be between 101 and 999 (inclusive)
export const items = {
  "101": {
    "id": 101,
    "name": "Crystal of Clarity",
    "type": "Healing",
    "affected": "hp",
    "effect": +20,
    "dialogueId": null
  },
  "999": {
    "id": 999,
    "name": "Excalibur",
    "type": "Weapon",
    "affected": "attack",
    "effect": 99,
    "dialogueId": null
  }
}

// Enemies IDs must be between 1001 and 1999 (inclusive)
export const enemies = {
  "1001": {
    "id": 1001,
    "name": "Crystal of Shadow",
    "type": "Enemy",
    "level": null,
    "mhp": null,
    "hp": null,
    "attack": null,
    "loot": [],
    "dialogueId": null
  }
}

// Dialogues must be between 3001 and 3999 (inclusive)
export const dialogues = {
  "3001": {
    "id": 3001,
    "name": "Tutorial 1",
    "type": "Dialogue",
    "content": {
      "0": {
        "character": "Alice",
        "characterId": 9001,
        "text": "Oh, hello there, little Muup! What brings you here today?",
        "triggers": []
      },
      "1": {
        "character": "Muup",
        "characterId": "player",
        "text": "I was just browsing on the Int... I mean, I was just strolling in the forst.",
        "triggers": []
      },
      "2": {
        "character": "Alice",
        "characterId": 9001,
        "text": "I see! In any case, you came at the right time! It looks like we have a bit of trouble in the forest.",
        "triggers": []

      },
      "3": {
        "character": "Muup",
        "characterId": "player",
        "text": "Oh... what happened? (Maybe I shouldn't have clicked on the Tutorial button).",
        "triggers": []

      },
      "4": {
        "character": "Alice",
        "characterId": 9001,
        "text": "Strange crystals with dark energy started appearing and they are corrupting the forest... oh, no!",
        "triggers": []
      },
      "5": {
        "character": null,
        "characterId": "voiceover",
        "text": "--A strange, dark crystal appeared next to Alice--",
        "triggers": [
          {
            "type": "placeObject",
            "coordinates": [5, 9],
            "objectType": "enemy",
            "objectid": "1001",
            "objectAmount": 1,
            "dialogueId": null
          }
        ]
      },
      "6": {
        "character": "Alice",
        "characterId": 9001,
        "text": "Ach! Please help me get rid of it, little Muup!",
        "triggers": []
      },
      "7": {
        "character": "Muup",
        "characterId": "player",
        "text": "Umm... why must I be *little* Muup?",
        "triggers": []
      },
      "8": {
        "character": "Alice",
        "characterId": 9001,
        "text": "That doesn't matter! Just get rid of it first, please!",
        "triggers": []
      }
    }
  }
}

// NPC IDs must be between 9001 and 9999 (inclusive)
export const npcs = {
  "9001": {
    "id": 9001,
    "name": "Alice",
    "type": "NPC",
    "level": 999,
    "mhp": 9999,
    "hp": 9999,
    "attack": 9999,
    "loot": "Caliburn",
    "dialogueId": null,
  }
}
