/**
 * useDonutAnimation.test.js
 *
 * Unit tests para el hook useDonutAnimation
 * Verifica:
 * - Filtrado correcto de segmentos sin valores
 * - Orden correcto de animación
 * - Crecimiento de ángulos
 * - Reinicio cuando datos cambian
 */

import { renderHook, waitFor } from '@testing-library/react';
import { useDonutAnimation } from './useDonutAnimation';

describe('useDonutAnimation', () => {
  // Mock de requestAnimationFrame
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  /**
   * Test 1: Segmentos se inicializan correctamente
   */
  test('inicializa segmentos correctamente', () => {
    const segments = [
      { id: 'varios', label: 'Varios', color: '#FDE68A', pct: 10 },
      { id: 'ocio', label: 'Ocio', color: '#C4B5FD', pct: 20 },
      { id: 'ahorro', label: 'Ahorro', color: '#86EFAC', pct: 30 },
      { id: 'deuda', label: 'Deuda', color: '#FCA5A5', pct: 25 },
      { id: 'fijos', label: 'Fijos', color: '#93C5FD', pct: 15 },
    ];

    const { result } = renderHook(() => useDonutAnimation(segments));

    expect(result.current.animatedArcs).toHaveLength(5);
    expect(result.current.isAnimating).toBe(true);
  });

  /**
   * Test 2: Filtra segmentos con pct = 0
   */
  test('filtra segmentos sin valores (pct = 0)', () => {
    const segments = [
      { id: 'varios', label: 'Varios', color: '#FDE68A', pct: 15 },
      { id: 'ocio', label: 'Ocio', color: '#C4B5FD', pct: 0 }, // Sin valor
      { id: 'ahorro', label: 'Ahorro', color: '#86EFAC', pct: 20 },
      { id: 'deuda', label: 'Deuda', color: '#FCA5A5', pct: 0 }, // Sin valor
      { id: 'fijos', label: 'Fijos', color: '#93C5FD', pct: 65 },
    ];

    const { result } = renderHook(() => useDonutAnimation(segments));

    // Solo 3 segmentos: Varios, Ahorro, Fijos
    expect(result.current.animatedArcs).toHaveLength(3);
    expect(result.current.animatedArcs[0].id).toBe('varios');
    expect(result.current.animatedArcs[1].id).toBe('ahorro');
    expect(result.current.animatedArcs[2].id).toBe('fijos');
  });

  /**
   * Test 3: Orden correcto de segmentos
   */
  test('mantiene orden correcto: Saldo (si existe) → Varios → Ocio → Ahorro → Deuda → Fijos', () => {
    const segments = [
      { id: 'varios', label: 'Varios', color: '#FDE68A', pct: 10 },
      { id: 'ocio', label: 'Ocio', color: '#C4B5FD', pct: 20 },
      { id: 'ahorro', label: 'Ahorro', color: '#86EFAC', pct: 30 },
      { id: 'deuda', label: 'Deuda', color: '#FCA5A5', pct: 25 },
      { id: 'fijos', label: 'Fijos', color: '#93C5FD', pct: 15 },
    ];

    const { result } = renderHook(() => useDonutAnimation(segments));

    const ids = result.current.animatedArcs.map(arc => arc.id);
    expect(ids).toEqual(['varios', 'ocio', 'ahorro', 'deuda', 'fijos']);
  });

  /**
   * Test 4: Los ángulos comienzan en 0
   */
  test('ángulos inician en 0 (antes de la animación)', () => {
    const segments = [
      { id: 'varios', label: 'Varios', color: '#FDE68A', pct: 30 },
      { id: 'fijos', label: 'Fijos', color: '#93C5FD', pct: 70 },
    ];

    const { result } = renderHook(() => useDonutAnimation(segments));

    // Al inicio, todos los ángulos son 0
    result.current.animatedArcs.forEach(arc => {
      expect(arc.startAngle).toBeLessThanOrEqual(1); // Casi 0 o animándose
    });
  });

  /**
   * Test 5: Los ángulos finales son correctos después de la animación
   */
  test('ángulos finales son correctos después de animación completada', async () => {
    const segments = [
      { id: 'varios', label: 'Varios', color: '#FDE68A', pct: 10 },
      { id: 'fijos', label: 'Fijos', color: '#93C5FD', pct: 90 },
    ];

    const { result } = renderHook(() => useDonutAnimation(segments));

    // Avanzar el tiempo hasta que se complete la animación
    jest.advanceTimersByTime(1500); // 1.5 segundos (más que TOTAL_ANIMATION_TIME de 1.0s)

    await waitFor(() => {
      expect(result.current.isAnimating).toBe(false);
    });

    // Verificar que los ángulos finales sean correctos
    const variosArc = result.current.animatedArcs[0];
    const fijosArc = result.current.animatedArcs[1];

    // Varios: 10% * 360 = 36 grados
    expect(variosArc.endAngle).toBeCloseTo(36 - 0.3, 1);

    // Fijos: 90% * 360 = 324 grados (desde 36 hasta 360)
    expect(fijosArc.endAngle).toBeCloseTo(360 - 0.3, 1);
  });

  /**
   * Test 6: La animación reinicia cuando los datos cambian
   */
  test('reinicia animación cuando los segments cambian', async () => {
    const segments1 = [
      { id: 'varios', label: 'Varios', color: '#FDE68A', pct: 50 },
      { id: 'fijos', label: 'Fijos', color: '#93C5FD', pct: 50 },
    ];

    const { result, rerender } = renderHook(
      ({ segs }) => useDonutAnimation(segs),
      { initialProps: { segs: segments1 } }
    );

    const initialArcs = result.current.animatedArcs;

    // Cambiar los datos
    const segments2 = [
      { id: 'varios', label: 'Varios', color: '#FDE68A', pct: 30 },
      { id: 'fijos', label: 'Fijos', color: '#93C5FD', pct: 70 },
    ];

    rerender({ segs: segments2 });

    // Verificar que se reinició (isAnimating = true nuevamente)
    expect(result.current.isAnimating).toBe(true);

    // Los ángulos deberían ser diferentes
    expect(result.current.animatedArcs[0].finalEnd).not.toBe(initialArcs[0].finalEnd);
  });

  /**
   * Test 7: isAnimating cambia correctamente
   */
  test('isAnimating es true durante la animación y false al terminar', async () => {
    const segments = [
      { id: 'varios', label: 'Varios', color: '#FDE68A', pct: 50 },
      { id: 'fijos', label: 'Fijos', color: '#93C5FD', pct: 50 },
    ];

    const { result } = renderHook(() => useDonutAnimation(segments));

    // Al inicio, isAnimating es true
    expect(result.current.isAnimating).toBe(true);

    // Avanzar el tiempo (1.0s es la duración, así que 1.5s para asegurar)
    jest.advanceTimersByTime(1500);

    // Esperar a que se complete
    await waitFor(() => {
      expect(result.current.isAnimating).toBe(false);
    });
  });

  /**
   * Test 8: Verifica que Saldo se incluya si existe
   */
  test('incluye Saldo al inicio si está en segments', () => {
    const segments = [
      { id: 'saldo', label: 'Saldo', color: '#CBD5E1', pct: 20 },
      { id: 'varios', label: 'Varios', color: '#FDE68A', pct: 15 },
      { id: 'ocio', label: 'Ocio', color: '#C4B5FD', pct: 20 },
      { id: 'ahorro', label: 'Ahorro', color: '#86EFAC', pct: 20 },
      { id: 'deuda', label: 'Deuda', color: '#FCA5A5', pct: 15 },
      { id: 'fijos', label: 'Fijos', color: '#93C5FD', pct: 10 },
    ];

    const { result } = renderHook(() => useDonutAnimation(segments));

    expect(result.current.animatedArcs[0].id).toBe('saldo');
    expect(result.current.animatedArcs).toHaveLength(6);
  });

  /**
   * Test 9: Cleanup - cancela animación al desmontar
   */
  test('limpia requestAnimationFrame al desmontar', () => {
    const segments = [
      { id: 'varios', label: 'Varios', color: '#FDE68A', pct: 50 },
      { id: 'fijos', label: 'Fijos', color: '#93C5FD', pct: 50 },
    ];

    const { unmount } = renderHook(() => useDonutAnimation(segments));

    const cancelSpy = jest.spyOn(global, 'cancelAnimationFrame');

    unmount();

    // Verificar que cancelAnimationFrame fue llamado
    expect(cancelSpy).toHaveBeenCalled();
    cancelSpy.mockRestore();
  });
});
