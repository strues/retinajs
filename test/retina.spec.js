import { expect } from 'chai';
import { environment, hasWindow, forceOriginalDimensions } from '../src/retina';
const { describe, it } = global;

describe('RetinaJS Environment', () => {
  it('should have window available', () => {
    const result = hasWindow;
    expect(result).to.be.equal(true);
  });
  it('should default to 1 pixel ratio', () => {
    const result = environment;
    expect(result).to.be.equal(1);
  });
});
