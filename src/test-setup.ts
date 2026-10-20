// jsdom no trae IndexedDB; Dexie lo toma al cargarse, así que debe existir antes de importarlo.
import 'fake-indexeddb/auto';
