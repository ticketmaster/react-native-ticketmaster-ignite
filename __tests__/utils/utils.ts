import { toCapitalise } from '../../src/utils/utils';

describe('utils', () => {
  describe('toCapitalise', () => {
    it('capitalises first letter in the string', () => {
      const result = toCapitalise('hello i am test');
      expect(result).toEqual('Hello i am test');
    });

    it('leaves string unchanged when the first letter is capitalised', () => {
      const result = toCapitalise('Hello i am test');
      expect(result).toEqual('Hello i am test');
    });
  });
});
