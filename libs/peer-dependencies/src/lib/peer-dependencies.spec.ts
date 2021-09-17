import { peerDependencies } from './peer-dependencies';

describe('peerDependencies', () => {
  it('should work', () => {
    expect(peerDependencies()).toEqual('peer-dependencies');
  });
});
