import { describe, it, expect } from 'vitest';
import { calculateMean, calculateMedian, calculateP99 } from '../src/metrics.js';

describe('Metrics Calculations', () => {
    describe('Edge Cases', () => {
        it('should return null for empty arrays', () => {
            expect(calculateMean([])).toBeNull();
            expect(calculateMedian([])).toBeNull();
            expect(calculateP99([])).toBeNull();
        });

        it('should handle single-item arrays', () => {
            expect(calculateMean([5])).toBe(5);
            expect(calculateMedian([5])).toBe(5);
            expect(calculateP99([5])).toBe(5);
        });
        
        it('should not mutate the input array', () => {
            const input = [3, 1, 2];
            const inputCopy = [...input];
            
            calculateMedian(input);
            calculateP99(input);
            
            expect(input).toEqual(inputCopy);
        });
    });

    describe('Median Logic', () => {
        it('should calculate correct median for odd length arrays', () => {
            expect(calculateMedian([5, 2, 9, 1, 7])).toBe(5); // sorted: 1, 2, 5, 7, 9
        });

        it('should calculate correct median for even length arrays', () => {
            expect(calculateMedian([5, 2, 9, 1, 7, 4])).toBe(4.5); // sorted: 1, 2, 4, 5, 7, 9 -> (4+5)/2
        });
    });

    describe('Unsorted Mock Dataset of 100 items', () => {
        // Generate an array of 100 items for testing (1 to 100, but unsorted)
        const dataset = [];
        for (let i = 1; i <= 100; i++) {
            dataset.push(i);
        }
        
        // Shuffle the array deterministically or use a pseudo-random approach
        // For testing purposes, Math.random() is fine, but static scrambling is more deterministic
        for (let i = dataset.length - 1; i > 0; i--) {
            // Simple deterministic scramble using modulo
            const j = (i * 7) % (i + 1);
            [dataset[i], dataset[j]] = [dataset[j], dataset[i]];
        }

        it('should correctly calculate the mean (50.5)', () => {
            // Sum of 1 to 100 = 5050. Mean = 50.5
            expect(calculateMean(dataset)).toBe(50.5);
        });

        it('should correctly calculate the median (50.5)', () => {
            // Median of 1 to 100 is (50 + 51) / 2 = 50.5
            expect(calculateMedian(dataset)).toBe(50.5);
        });

        it('should correctly calculate the 99th percentile (99)', () => {
            // 99th percentile of 100 items sorted 1..100.
            // Index = ceil(0.99 * 100) - 1 = 99 - 1 = 98.
            // Element at index 98 is 99.
            expect(calculateP99(dataset)).toBe(99);
        });
    });
});
