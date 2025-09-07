
export enum ComicStyle {
  Manga = 'Manga',
  Western = 'Western',
  Minimalist = 'Minimalist',
}

export enum Language {
  English = 'English',
  Tamil = 'Tamil',
  Hindi = 'Hindi',
  Arabic = 'Arabic',
  Spanish = 'Spanish',
  Japanese = 'Japanese',
}

export interface Panel {
  scene: string;
  action: string;
  mood: string;
}

export interface ComicFormState {
  story: string;
  language: Language;
  style: ComicStyle;
  panels: number;
}
