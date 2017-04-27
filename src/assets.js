// Items IDs must be between 101 and 999 (inclusive)
export const items = {
  "101": {
    "id": 101,
    "name": "Crystal of Clarity",
    "type": "Healing",
    "scalable": true,
    "affected": "hp",
    "effect": null,
    "dialogueid": null
  },
  "701": {
    "id": 701,
    "name": "Caliburn Replica",
    "type": "Weapon",
    "scalable": false,
    "affected": "attack",
    "effect": +9,
    "dialogueid": null
  },
  "901": {
    "id": 901,
    "name": "Crystal of Clarity",
    "type": "Healing",
    "scalable": false,
    "affected": "hp",
    "effect": +50,
    "dialogueid": null
  },
  "990": {
    "id": 990,
    "name": "Excalibur",
    "type": "Weapon",
    "scalable": false,
    "affected": "attack",
    "effect": +100,
    "dialogueid": null
  },
  "999": {
    "id": 999,
    "name": "Alice's Caliburn",
    "type": "Weapon",
    "scalable": false,
    "affected": "attack",
    "effect": +9998,
    "dialogueid": null
  }
}

// Enemies IDs must be between 1001 and 1999 (inclusive)
export const enemies = {
  "1001": {
    "id": 1001,
    "name": "Crystal of Shadow",
    "type": "Enemy",
    "scalable": false,
    "level": 1,
    "mhp": 20,
    "hp": 20,
    "attack": 10,
    "xp": 36,
    "loot": [],
    "dialogueid": null
  },
  "1101": {
    "id": 1101,
    "name": "Crystal of Shadow",
    "type": "Enemy",
    "scalable": true,
    "level": -2,
    "mhp": null,
    "hp": null,
    "attack": null,
    "xp": null,
    "loot": [],
    "dialogueid": null
  },
  "1102": {
    "id": 1102,
    "name": "Crystal of Shadow",
    "type": "Enemy",
    "scalable": true,
    "level": -1,
    "mhp": null,
    "hp": null,
    "attack": null,
    "xp": null,
    "loot": [],
    "dialogueid": null
  },
  "1103": {
    "id": 1103,
    "name": "Crystal of Shadow",
    "type": "Enemy",
    "scalable": true,
    "level": 0,
    "mhp": null,
    "hp": null,
    "attack": null,
    "xp": null,
    "loot": [],
    "dialogueid": null
  },
  "1104": {
    "id": 1104,
    "name": "Crystal of Shadow",
    "type": "Enemy",
    "scalable": true,
    "level": 1,
    "mhp": null,
    "hp": null,
    "attack": null,
    "xp": null,
    "loot": [],
    "dialogueid": null
  },
  "1105": {
    "id": 1105,
    "name": "Crystal of Shadow",
    "type": "Enemy",
    "scalable": true,
    "level": 2,
    "mhp": null,
    "hp": null,
    "attack": null,
    "xp": null,
    "loot": [],
    "dialogueid": null
  },
  "1199": {
    "id": 1199,
    "name": "Ayrithlia",
    "type": "Boss",
    "scalable": true,
    "level": 10,
    "mhp": null,
    "hp": null,
    "attack": null,
    "xp": null,
    "loot": [],
    "dialogueid": 3200
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
        "text": "I see! In any case, you came at the right time! It looks like we have a bit of trouble in the forest.",
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
        "character": null,
        "characterid": "voiceover",
        "text": "--A strange, dark crystal appeared next to Alice--",
        "triggers": [
          {
            "type": "placeObject",
            "coordinates": [5, 9],
            "objecttype": "enemy",
            "objectid": "1001",
            "objectamount": 1,
            "dialogueid": 3003
          }
        ]
      },
      "6": {
        "character": "Alice",
        "characterid": 9001,
        "text": "Ach! Please help me get rid of it, little Muup!",
        "triggers": []
      },
      "7": {
        "character": "Muup",
        "characterid": "player",
        "text": "Umm... why must I be *little* Muup?",
        "triggers": []
      },
      "8": {
        "character": "Alice",
        "characterid": 9001,
        "text": "That doesn't matter! Just get rid of it first, please!",
        "triggers": []
      },
      "9": {
        "character": null,
        "characterid": "voiceover",
        "text": "--Attack the strange crystal by moving towards it using either the direction keys or A, S, D, W--",
        "triggers": [
          {
            "type": "changeDialogue",
            "coordinates": [5, 7],
            "objecttype": "npc",
            "objectid": "9001",
            "dialogueid": 3002
          }
        ]
      },
    }
  },
  "3002": {
    "id": 3002,
    "name": "Tutorial 2",
    "type": "Dialogue",
    "content": {
      "0": {
        "character": "Alice",
        "characterid": 9001,
        "text": "Go get rid of the crystal already!",
        "triggers": []
      }
    }
  },
  "3003": {
    "id": 3003,
    "name": "Tutorial 3",
    "type": "Dialogue",
    "content": {
      "0": {
        "character": null,
        "characterid": "voiceover",
        "text": "--The crystal crumbles to dust.  I should go speak with Alice--",
        "triggers": [
          {
            "type": "changeDialogue",
            "coordinates": [5, 7],
            "objecttype": "npc",
            "objectid": "9001",
            "dialogueid": 3004
          }
        ]
      }
    }
  },
  "3004": {
    "id": 3004,
    "name": "Tutorial 4",
    "type": "Dialogue",
    "content": {
      "0": {
        "character": "Alice",
        "characterid": 9001,
        "text": "Good job, little Muup! Thank you very much for saving us!",
        "triggers": []
      },
      "1": {
        "character": "Alice",
        "characterid": 9001,
        "text": "*Mumbles* Check! That covers the basics of combat... *mumbles*.",
        "triggers": []
      },
      "2": {
        "character": "Muup",
        "characterid": "player",
        "text": "Wait a minute, what did you say just now?",
        "triggers": []
      },
      "3": {
        "character": "Alice",
        "characterid": 9001,
        "text": "OH! NOTHING! *ABSOLUTELY* NOTHING.",
        "triggers": []
      },
      "4": {
        "character": "Alice",
        "characterid": 9001,
        "text": "Here! Heal up with a Crystal of Clairty! ^^",
        "triggers": [
          {
            "type": "placeObject",
            "coordinates": [5, 5],
            "objecttype": "item",
            "objectid": "901",
            "objectamount": 1,
            "dialogueid": 3006
          },
          {
            "type": "changeDialogue",
            "coordinates": [5, 7],
            "objecttype": "npc",
            "objectid": "9001",
            "dialogueid": 3005
          }
        ]
      },
    }
  },
  "3005": {
    "id": 3005,
    "name": "Tutorial 5",
    "type": "Dialogue",
    "content": {
      "0": {
        "character": "Alice",
        "characterid": 9001,
        "text": "Go on, don't be shy, it's my treat.",
        "triggers": []
      }
    }
  },
  "3006": {
    "id": 3006,
    "name": "Tutorial 6",
    "type": "Dialogue",
    "content": {
      "0": {
        "character": null,
        "characterid": "voiceover",
        "text": "--HP fully restored--",
        "triggers": [
          {
            "type": "changeDialogue",
            "coordinates": [5, 7],
            "objecttype": "npc",
            "objectid": "9001",
            "dialogueid": 3007
          }
        ]
      }
    }
  },
  "3007": {
    "id": 3007,
    "name": "Tutorial 7",
    "type": "Dialogue",
    "content": {
      "0": {
        "character": "Alice",
        "characterid": 9001,
        "text": "Apart from healing items, you will come aross different types of items during your journey in the forest.",
        "triggers": []
      },
      "1": {
        "character": "Alice",
        "characterid": 9001,
        "text": "Weapons, for example, increase the damage you deal to enemies.  Here, try this sword.",
        "triggers": [
          {
            "type": "changeDialogue",
            "coordinates": [5, 7],
            "objecttype": "npc",
            "objectid": "9001",
            "dialogueid": 3008
          },
          {
            "type": "placeObject",
            "coordinates": [7, 7],
            "objecttype": "item",
            "objectid": "999",
            "objectamount": 1,
            "dialogueid": 3009
          }
        ]
      },
    }
  },
  "3008": {
    "id": 3008,
    "name": "Tutorial 8",
    "type": "Dialogue",
    "content": {
      "0": {
        "character": "Alice",
        "characterid": 9001,
        "text": "Try picking up the weapon see how your attack power changes with it.",
        "triggers": []
      },
    }
  },
  "3009": {
    "id": 3009,
    "name": "Tutorial 9",
    "type": "Dialogue",
    "content": {
      "0": {
        "character": null,
        "characterid": "voiceover",
        "text": "--Attack power increased dramatically--",
        "triggers": [
          {
            "type": "changeDialogue",
            "coordinates": [5, 7],
            "objecttype": "npc",
            "objectid": "9001",
            "dialogueid": 3010
          }
        ]
      },
    }
  },
  "3010": {
    "id": 3010,
    "name": "Tutorial 10",
    "type": "Dialogue",
    "content": {
      "0": {
        "character": "Muup",
        "characterid": "player",
        "text": "Thanks, Alice! I think the rest of the journey will be fine with this sword!",
        "triggers": []
      },
      "1": {
        "character": "Alice",
        "characterid": 9001,
        "text": "Sorry, little Muup.  I have to take Caliburn back.",
        "triggers": []
      },
      "2": {
        "character": "Muup",
        "characterid": "player",
        "text": "Wait... what!? You can't do that to me!",
        "triggers": []
      },
      "3": {
        "character": "Alice",
        "characterid": 9001,
        "text": "Caliburn must be kept in this sanctuary and, uh... my life is, um... tied to it.",
        "triggers": []
      },
      "4": {
        "character": "Alice",
        "characterid": 9001,
        "text": "Really.  REALLY!",
        "triggers": []
      },
      "5": {
        "character": "Alice",
        "characterid": 9001,
        "text": "Here, you can have a replica that is *almost* just as good.",
        "triggers": []
      },
      "6": {
        "character": "Muup",
        "characterid": "player",
        "text": "Oh! Thanks a bunch, Alice! (Is it just me or did Alice shift her gaze for a brief moment?)",
        "triggers": []
      },
      "7": {
        "character": "Alice",
        "characterid": 9001,
        "text": "*Mumbles* Phew... that was close *mumbles*.",
        "triggers": []
      },
      "8": {
        "character": "Alice",
        "characterid": 9001,
        "text": "Alrighty! I think you are ready for your adventure!",
        "triggers": []
      },
      "9": {
        "character": "Alice",
        "characterid": 9001,
        "text": "Just go to the exit to begin your adventure! I will miss you, little Muup!",
        "triggers": [
          {
            "type": "changeDialogue",
            "coordinates": [5, 7],
            "objecttype": "npc",
            "objectid": "9001",
            "dialogueid": 3011
          },
          {
            "type": "placeObject",
            "coordinates": [12, 12],
            "objecttype": "exit",
            "objectid": null,
            "objectamount": 1,
            "dialogueid": null
          }
        ]
      },
    }
  },
  "3011": {
    "id": 3011,
    "name": "Tutorial 11",
    "type": "Dialogue",
    "content": {
      "0": {
        "character": "Alice",
        "characterid": 9001,
        "text": "Bye, little Muup!",
        "triggers": []
      },
    }
  },
  "3200": {
    "id": 3200,
    "name": "Ayrithlia's Last Words",
    "type": "Dialogue",
    "content": {
      "0": {
        "character": "Ayrithlia",
        "characterid": 1199,
        "text": "This is not the end...",
        "triggers": []
      },
      "1": {
        "character": null,
        "characterid": "voiceover",
        "text": "--An exit has appeared--",
        "triggers": [
          {
            "type": "placeObject",
            "coordinates": [],
            "objecttype": "exit",
            "objectid": null,
            "objectamount": 1,
            "dialogueid": null
          }
        ]
      },
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
    "dialogueid": null,
  }
}
