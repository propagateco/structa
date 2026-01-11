// Define font map for consistent use across the application
export const FONT_MAP: Record<string, string> = {
	inter: '"Inter", sans-serif',
	roboto: '"Roboto", sans-serif',
	'open-sans': '"Open Sans", sans-serif',
	lato: '"Lato", sans-serif',
	montserrat: '"Montserrat", sans-serif',
	poppins: '"Poppins", sans-serif',
};

export type Font = {
	name: string;
	value: string;
	family: string;
};

export const FONTS: Font[] = [
	{ name: 'Inter', value: 'inter', family: FONT_MAP['inter'] },
	{ name: 'Roboto', value: 'roboto', family: FONT_MAP['roboto'] },
	{ name: 'Open Sans', value: 'open-sans', family: FONT_MAP['open-sans'] },
	{ name: 'Lato', value: 'lato', family: FONT_MAP['lato'] },
	{ name: 'Montserrat', value: 'montserrat', family: FONT_MAP['montserrat'] },
	{ name: 'Poppins', value: 'poppins', family: FONT_MAP['poppins'] },
];
