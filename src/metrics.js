/**
 * Calculates the mean (average) of an array of numbers.
 * @param {number[]} arr - Array of response times
 * @returns {number|null}
 */
export function calculateMean(arr) {
    if (!arr || arr.length === 0) return null;
    const sum = arr.reduce((acc, val) => acc + val, 0);
    return sum / arr.length;
}

/**
 * Calculates the median of an array of numbers.
 * Does not mutate the input array.
 * @param {number[]} arr - Array of response times
 * @returns {number|null}
 */
export function calculateMedian(arr) {
    if (!arr || arr.length === 0) return null;
    // Create a copy to prevent mutating the original array
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    
    if (sorted.length % 2 === 0) {
        return (sorted[mid - 1] + sorted[mid]) / 2;
    }
    return sorted[mid];
}

/**
 * Calculates the 99th percentile of an array of numbers.
 * Does not mutate the input array.
 * @param {number[]} arr - Array of response times
 * @returns {number|null}
 */
export function calculateP99(arr) {
    if (!arr || arr.length === 0) return null;
    // Create a copy to prevent mutating the original array
    const sorted = [...arr].sort((a, b) => a - b);
    const index = Math.ceil(0.99 * sorted.length) - 1;
    return sorted[Math.max(0, index)]; // Use max to ensure index is not negative, though min index is 0
}
