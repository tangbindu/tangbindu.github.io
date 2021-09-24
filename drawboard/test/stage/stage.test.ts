import Stage from '../../src/ts/stage/stage';
describe('test stage', () => {
  let stage;
  beforeAll(() => {
    stage = new Stage();
  });

  test('create stage', () => {
    expect(stage).toBeInstanceOf(Stage);
  });

  test('set and get stage size', () => {
    const width = 500;
    const height = 600;
    stage.setSize(width, height);
    expect(stage.width).toEqual(width);
    expect(stage.height).toEqual(height);
    const newSize = stage.getSize();
    expect(newSize).toEqual({width,height})
  });
});
