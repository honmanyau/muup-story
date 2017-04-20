// Items IDs must be between 101 and 999 (inclusive)
export const items = {
  i101: {
    id: 101,
    name: 'Crystal of Clarity',
    type: 'Healing',
    affected: 'hp',
    effect: +20
  },
  i999: {
    id: 999,
    name: 'Excalibur',
    type: 'Weapon',
    affected: 'attack',
    effect: 99
  }
}

// Enemies IDs must be between 1001 and 1999 (inclusive)
export const enemies = {
  e1001: {
    id: 1001,
    name: '',
    type: 'Enemy',
    level: 1,
    mhp: 25,
    hp: 25,
    attack: 10,
    loot: ''
  }
}
