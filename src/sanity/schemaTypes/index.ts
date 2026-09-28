import { car } from './car';
import { homePage } from './homePage';
import { objectTypes } from './objects';
import { siteSettings } from './siteSettings';

export const schemaTypes = [...objectTypes, car, siteSettings, homePage];
