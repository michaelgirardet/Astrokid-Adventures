export interface CharacterStats {
	name: string;
	description: string;
	speed: number;
	jump: number;
	attack: number;
	hearts: number;
	abilityName: string;
	abilityDesc: string;
	style: string;
}

export const CHARACTER_STATS: Record<string, CharacterStats> = {
	yellow: {
		name: "Astro",
		description:
			"Astro est le héros principal, équilibré et intuitif. Le choix idéal pour découvrir l’aventure.",
		speed: 3,
		jump: 3,
		attack: 3,
		hearts: 3,
		abilityName: "Rebond maîtrisé",
		abilityDesc:
			"Rebond légèrement plus haut (+10%) sur les ennemis, idéal pour gagner de la hauteur.",
		style: "Polyvalent, recommandée pour débuter.",
	},

	green: {
		name: "Gloopy",
		description:
			"Gloopy est vif et élastique. Grâce à sa faible gravité, il excelle dans les environnements verticaux.",
		speed: 3,
		jump: 5,
		attack: 2,
		hearts: 3,
		abilityName: "Gelée Aérienne",
		abilityDesc:
			"Gravité réduite : permet de corriger facilement sa trajectoire en l’air.",
		style: "Idéal pour explorer les zones difficiles d’accès.",
	},

	purple: {
		name: "Cyclop",
		description:
			"Plus lourd mais très puissant en attaque. Un spécialiste des projectiles.",
		speed: 2,
		jump: 2,
		attack: 5,
		hearts: 3,
		abilityName: "Turbo-lancer",
		abilityDesc: "Projette les briques 40% plus loin et vite.",
		style: "Pour les joueurs qui aiment éliminer les ennemis à distance.",
	},
};
