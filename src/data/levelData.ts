export interface LevelData {
	id: string;
	name: string;
	mapKey: string;
	locked?: boolean;
}

export const LEVELS: LevelData[] = [
	{
		id: "level1",
		name: "Chemin des mousses",
		mapKey: "forest_level",
		locked: false,
	},
	{
		id: "level2",
		name: "Plateau mycélien",
		mapKey: "level_mushrooms",
		locked: false,
	},
	{
		id: "level3",
		name: "Route des mirages",
		mapKey: "ice_level",
		locked: true,
	},
];
