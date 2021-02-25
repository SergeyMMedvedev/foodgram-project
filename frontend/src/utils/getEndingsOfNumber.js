export default function getNumberEnding(number) {
  const stringNumber = number.toString();
  if (number >= 1) {
    if (['11', '12', '13', '14', '15', '16', '17', '18', '19'].includes(stringNumber.slice((stringNumber.length - 2), stringNumber.length))) {
      return 'рецептов';
    }
    if (['40', '90'].includes(stringNumber.slice((stringNumber.length - 2), stringNumber.length))) {
      return 'рецептов';
    }
    if (stringNumber.endsWith('100')) {
      return 'рецептов';
    }

    if (stringNumber.endsWith('1')) {
      return 'рецепт';
    }
    if (['2', '3', '4'].includes(stringNumber[stringNumber.length - 1])) {
      return 'рецепта';
    }
    if (stringNumber.endsWith('00')) {
      return 'рецептов';
    }
    return 'рецепт';
  }
  return 'рецепт';
}
