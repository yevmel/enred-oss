let counter = 0;

/** Reasonably-unique id with a readable prefix (`e` for entities, `r` for relations). */
export function genId(prefix: string): string {
  return prefix + Date.now().toString(36) + (counter++).toString(36);
}
