import { describe, expect, it } from 'vitest';

import { lineSubtotal, sumAmounts } from './order-math';

describe('order-math', () => {
  it('suma extras al precio y multiplica por la cantidad', () => {
    expect(lineSubtotal(45, [10, 8], 2)).toBe(126);
  });

  it('evita errores de punto flotante', () => {
    expect(lineSubtotal(0.1, [0.2], 1)).toBe(0.3);
    expect(sumAmounts([0.1, 0.2])).toBe(0.3);
  });
});
