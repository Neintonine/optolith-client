/**
 * Return a random integer between 1 (included) and the passed parameter
 * (included).
 * @param sides The langest random number
 * @example rollDice(6) // D6
 */
export const rollDie = (sides: number): number =>
  Math.floor(Math.random() * sides) + 1;

/**
 * Returns the sum of random integers between 1 (included) and the passed parameter
 * (included).
 * @param sides The langest random number
 * @example rollDice(2, 6) // 2D6
 */
export const rollDice = (
  amount: number,
  sides: number,
  fn = (a: number) => a + rollDie(sides)
): number =>
  Array(amount).reduce(fn, 0);
