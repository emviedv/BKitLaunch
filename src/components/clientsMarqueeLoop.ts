/**
 * Utilities for preparing marquee client lists.
 * Ensures there is enough content to animate without gaps by repeating entries.
 */
export interface LoopClientLike {
  name: string;
  [key: string]: any;
}

export const CLIENT_LOOP_MIN_LENGTH = 16;

export const buildLoopedClients = (clients: LoopClientLike[]): LoopClientLike[] => {
  if (!Array.isArray(clients) || clients.length === 0) {
    return [];
  }

  const repeats = Math.max(2, Math.ceil(CLIENT_LOOP_MIN_LENGTH / clients.length));
  const looped: LoopClientLike[] = [];

  for (let pass = 0; pass < repeats; pass += 1) {
    looped.push(...clients);
  }

  return looped;
};
