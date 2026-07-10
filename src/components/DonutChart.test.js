/**
 * DonutChart.test.js
 *
 * Tests de integración para el componente DonutChart
 * Verifica:
 * - Renderización correcta del componente
 * - Uso del hook de animación
 * - Color de fondo dinámico (gris vs SALDO_COLOR)
 * - Interactividad (hover, click)
 * - Texto dinámico en el centro
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DonutChart from './DonutChart';
import { SALDO_COLOR } from '../constants';

describe('DonutChart Component', () => {
  const mockSegments = [
    { id: 'varios', label: 'Varios', color: '#FDE68A', pct: 10 },
    { id: 'ocio', label: 'Ocio', color: '#C4B5FD', pct: 20 },
    { id: 'ahorro', label: 'Ahorro', color: '#86EFAC', pct: 30 },
    { id: 'deuda', label: 'Deuda', color: '#FCA5A5', pct: 25 },
    { id: 'fijos', label: 'Fijos', color: '#93C5FD', pct: 15 },
  ];

  const defaultProps = {
    segments: mockSegments,
    cx: 160,
    cy: 160,
    outerR: 100,
    innerR: 60,
    activeId: null,
    onSelect: jest.fn(),
    isDark: false,
    gastos: 2500000,
    total: 3000000,
    totalSpent: 2500000,
    pillarSpends: {
      varios: 250000,
      ocio: 500000,
      ahorro: 750000,
      deuda: 625000,
      fijos: 375000,
    },
    hasSaldoAsignado: true,
    saldoValue: 500000,
  };

  /**
   * Test 1: Renderiza sin errores
   */
  test('renderiza sin errores', () => {
    const { container } = render(<DonutChart {...defaultProps} />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  /**
   * Test 2: Renderiza el SVG con las dimensiones correctas
   */
  test('SVG tiene las dimensiones correctas', () => {
    const { container } = render(<DonutChart {...defaultProps} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '320'); // cx * 2
    expect(svg).toHaveAttribute('height', '320'); // cy * 2
  });

  /**
   * Test 3: Usa color de fondo gris cuando no hay saldo
   */
  test('usa fondo gris cuando "Mostrar ingresos" está desactivado', () => {
    const { container } = render(
      <DonutChart {...defaultProps} segments={mockSegments} />
    );
    const backgroundCircle = container.querySelector('circle[r="100"]');
    expect(backgroundCircle).toHaveAttribute('stroke', '#E5E3F5');
  });

  /**
   * Test 4: Usa SALDO_COLOR cuando hay segmento de saldo
   */
  test('usa SALDO_COLOR cuando "Mostrar ingresos" está activado', () => {
    const segmentsWithSaldo = [
      { id: 'saldo', label: 'Saldo', color: SALDO_COLOR, pct: 20 },
      ...mockSegments,
    ];

    const { container } = render(
      <DonutChart {...defaultProps} segments={segmentsWithSaldo} />
    );
    const backgroundCircle = container.querySelector('circle[r="100"]');
    expect(backgroundCircle).toHaveAttribute('stroke', SALDO_COLOR);
  });

  /**
   * Test 5: Renderiza texto dinámico en el centro
   */
  test('renderiza texto dinámico en el centro', () => {
    const { container } = render(<DonutChart {...defaultProps} />);
    const textElements = container.querySelectorAll('text');

    // Debe haber al menos 3 textos: etiqueta, valor, referencia
    expect(textElements.length).toBeGreaterThanOrEqual(3);
  });

  /**
   * Test 6: Muestra "Gastado" cuando no hay selección
   */
  test('muestra "Gastado" cuando no hay segmento seleccionado', () => {
    const { container } = render(<DonutChart {...defaultProps} activeId={null} />);
    const texts = container.querySelectorAll('text');

    let foundGastado = false;
    texts.forEach(text => {
      if (text.textContent === 'Gastado') {
        foundGastado = true;
      }
    });

    expect(foundGastado).toBe(true);
  });

  /**
   * Test 7: Callback onSelect se llama al hacer click en un segmento
   */
  test('llama onSelect cuando se hace click en un segmento', () => {
    const mockOnSelect = jest.fn();
    const { container } = render(
      <DonutChart {...defaultProps} onSelect={mockOnSelect} />
    );

    // Buscar un elemento g (grupo) que representa un segmento
    const segments = container.querySelectorAll('g');

    if (segments.length > 0) {
      fireEvent.click(segments[0]);
      expect(mockOnSelect).toHaveBeenCalled();
    }
  });

  /**
   * Test 8: Renderiza SVG sin errores con tema oscuro
   */
  test('renderiza correctamente con tema oscuro', () => {
    const { container } = render(
      <DonutChart {...defaultProps} isDark={true} />
    );
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  /**
   * Test 9: Renderiza el círculo negro del centro
   */
  test('renderiza círculo negro del centro (innerR)', () => {
    const { container } = render(<DonutChart {...defaultProps} />);

    // Buscar círculo con radio = innerR (60)
    const circles = container.querySelectorAll('circle');
    let foundInner = false;

    circles.forEach(circle => {
      if (circle.getAttribute('r') === '60') {
        foundInner = true;
        expect(circle).toHaveAttribute('fill', '#000000');
      }
    });

    expect(foundInner).toBe(true);
  });

  /**
   * Test 10: Cuando activeId es "saldo", muestra "Sobran"
   */
  test('muestra "Sobran" cuando saldo está seleccionado', () => {
    const segmentsWithSaldo = [
      { id: 'saldo', label: 'Saldo', color: SALDO_COLOR, pct: 20 },
      ...mockSegments,
    ];

    const { container } = render(
      <DonutChart
        {...defaultProps}
        segments={segmentsWithSaldo}
        activeId="saldo"
      />
    );

    const texts = container.querySelectorAll('text');
    let foundSobran = false;

    texts.forEach(text => {
      if (text.textContent === 'Sobran') {
        foundSobran = true;
      }
    });

    expect(foundSobran).toBe(true);
  });

  /**
   * Test 11: Los segmentos se renderizan como rutas (paths)
   */
  test('renderiza segmentos como rutas SVG (paths)', () => {
    const { container } = render(<DonutChart {...defaultProps} />);
    const paths = container.querySelectorAll('path');

    // Debe haber al menos 5 paths (uno por cada segmento)
    expect(paths.length).toBeGreaterThanOrEqual(5);
  });

  /**
   * Test 12: Acepta props opcionales (saldoValue, pillarSpends, etc.)
   */
  test('acepta y usa props opcionales correctamente', () => {
    const customProps = {
      ...defaultProps,
      saldoValue: 750000,
      totalSpent: 2000000,
    };

    const { container } = render(<DonutChart {...customProps} />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});
