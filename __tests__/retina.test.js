import retina from '../src/retina';

describe('RetinaJS Environment', () => {
  it('should exist as a function on window', () => {
    const result = window.retinajs;
    expect(typeof result === 'function').toBe(true);
  });
});
