const pad2 = (n) => String(n).padStart(2, '0');

function range(from, to) {
  return Array.from({ length: to - from + 1 }, (_, i) => from + i);
}

function hallsForPrefixFloor(prefix, floor, start, end) {
  return range(start, end).map((i) => `${prefix}${floor}${pad2(i)}`);
}

function mainBuildingHalls(floor) {
  if (Number(floor) === 4) {
    return [...hallsForPrefixFloor('A', 4, 1, 12), ...hallsForPrefixFloor('B', 4, 1, 6)];
  }
  if (Number(floor) === 5) {
    return [...hallsForPrefixFloor('A', 5, 1, 4), ...hallsForPrefixFloor('B', 5, 1, 4)];
  }
  // Floor 6 was not explicitly specified in your description; this is a sensible default.
  if (Number(floor) === 6) {
    return [...hallsForPrefixFloor('A', 6, 1, 12), ...hallsForPrefixFloor('B', 6, 1, 6)];
  }
  return [];
}

function engineeringHalls(floor) {
  return hallsForPrefixFloor('E', Number(floor), 1, 10);
}

function newBuildingHalls(floor) {
  const f = Number(floor);
  return [...hallsForPrefixFloor('G', f, 1, 5), ...hallsForPrefixFloor('F', f, 1, 5)];
}

export const BUILDINGS = [
  {
    key: 'MAIN',
    label: 'Main Building',
    floors: [4, 5, 6],
    halls: mainBuildingHalls,
  },
  {
    key: 'NEW',
    label: 'New Building',
    floors: range(2, 14),
    halls: newBuildingHalls,
  },
  {
    key: 'ENG',
    label: 'Engineering Building',
    floors: range(1, 6),
    halls: engineeringHalls,
  },
  {
    key: 'OTHER',
    label: 'Other',
    floors: [],
    halls: () => [],
  },
];

export function getBuilding(key) {
  return BUILDINGS.find((b) => b.key === key) || null;
}

export function buildLocationString({ buildingKey, floor, hall, manualLocation }) {
  const building = getBuilding(buildingKey);
  if (!building || buildingKey === 'OTHER') {
    return (manualLocation || '').trim();
  }

  const safeFloor = String(floor).trim();
  const safeHall = String(hall).trim();
  return `${building.label} - Floor ${safeFloor} - ${safeHall}`;
}

export function parseLocationString(location) {
  const raw = (location || '').trim();
  if (!raw) {
    return { buildingKey: '', floor: '', hall: '', manualLocation: '' };
  }

  // Try to infer building by label prefix.
  const building = BUILDINGS.find((b) => b.key !== 'OTHER' && raw.toLowerCase().includes(b.label.toLowerCase()));
  if (!building) {
    return { buildingKey: 'OTHER', floor: '', hall: '', manualLocation: raw };
  }

  const floorMatch = raw.match(/\bfloor\s*(\d{1,2})\b/i);
  const floor = floorMatch ? floorMatch[1] : '';

  // Hall codes: A401, B406, E301, G405, F401 etc.
  const hallMatch = raw.match(/\b([ABEGF]\d{3})\b/i);
  const hall = hallMatch ? hallMatch[1].toUpperCase() : '';

  return {
    buildingKey: building.key,
    floor,
    hall,
    manualLocation: '',
  };
}
