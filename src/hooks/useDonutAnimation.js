/**
 * useDonutAnimation.js
 *
 * Custom hook para animar el crecimiento de arcos en un donut chart.
 * Maneja:
 * - Animación de crecimiento EN CASCADA (uno tras otro)
 * - Cada segmento crece desde su posición fija hasta su ángulo final
 * - Filtrado de segmentos sin valores (0%)
 * - Reinicio de animación cuando datos cambian
 * - Animación total: 1 segundo (0.2s por segmento + 0.2s delay entre cada uno)
 *
 * Retorna:
 * - animatedArcs: Array de arcos con ángulos animados
 * - isAnimating: Boolean indicando si está en animación
 */

import { useState, useEffect, useRef, useCallback } from 'react';

const SEGMENT_DURATION = 0.1; // segundos por cada segmento
const SEGMENT_DELAY = 0.1; // delay entre segmentos
const TOTAL_ANIMATION_TIME = 0.6; // segundos totales (0.1 + 5×0.1)

export const useDonutAnimation = (segments) => {
  const [animatedArcs, setAnimatedArcs] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef(null);
  const startTimeRef = useRef(null);

  /**
   * Calcula los arcos finales basado en porcentajes
   * Filtra segmentos con valor 0%
   */
  const calculateFinalArcs = useCallback((segs) => {
    let cursor = 0;
    const arcs = [];

    segs.forEach((seg) => {
      if (seg.pct > 0) { // Solo incluir segmentos con valores > 0
        const sweep = seg.pct * 3.6;
        arcs.push({
          ...seg,
          startAngle: cursor,
          endAngle: cursor + sweep - 0.3,
          finalStart: cursor,
          finalEnd: cursor + sweep - 0.3,
        });
        cursor += sweep;
      }
    });

    return arcs;
  }, []);

  /**
   * Calcula los ángulos interpolados basado en tiempo global
   * Cada segmento crece EN CASCADA: uno tras otro
   * El startAngle se mantiene FIJO, solo el endAngle crece
   */
  const interpolateArcs = useCallback((finalArcs, progress) => {
    return finalArcs.map((arc, idx) => {
      // Calcular cuando este segmento específico debe empezar y terminar
      const segmentStart = idx * SEGMENT_DELAY;
      const segmentEnd = segmentStart + SEGMENT_DURATION;

      // Calcular progreso SOLO para este segmento
      let segmentProgress = 0;
      if (progress >= segmentStart && progress < segmentEnd) {
        // Está en su rango de animación
        segmentProgress = (progress - segmentStart) / SEGMENT_DURATION;
      } else if (progress >= segmentEnd) {
        // Ya terminó su animación
        segmentProgress = 1;
      }

      // CORRECTO: startAngle FIJO, endAngle CRECE
      const interpolatedStart = arc.finalStart;
      const interpolatedEnd = arc.finalStart + (arc.finalEnd - arc.finalStart) * segmentProgress;

      return {
        ...arc,
        startAngle: interpolatedStart,
        endAngle: interpolatedEnd,
        progress: segmentProgress,
      };
    });
  }, []);

  /**
   * Inicia la animación con requestAnimationFrame
   */
  const animate = useCallback((finalArcs) => {
    setIsAnimating(true);
    startTimeRef.current = Date.now();

    const animationLoop = () => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000; // en segundos
      const progress = Math.min(1, elapsed / TOTAL_ANIMATION_TIME);

      const interpolated = interpolateArcs(finalArcs, progress);
      setAnimatedArcs(interpolated);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animationLoop);
      } else {
        // Animación completada
        setAnimatedArcs(finalArcs);
        setIsAnimating(false);
      }
    };

    animationRef.current = requestAnimationFrame(animationLoop);
  }, [interpolateArcs]);

  /**
   * Effect: Reiniciar animación cuando segments cambia
   */
  useEffect(() => {
    // Cancelar animación anterior si existe
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    // Calcular arcos finales
    const finalArcs = calculateFinalArcs(segments);

    // Iniciar nueva animación
    animate(finalArcs);

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [segments, calculateFinalArcs, animate]);

  return {
    animatedArcs,
    isAnimating,
  };
};
