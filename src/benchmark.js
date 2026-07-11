import { calculateMean, calculateMedian, calculateP99 } from './metrics.js';

/**
 * Runs a benchmark against a given URL by making sequential fetch requests.
 * @param {string} url - The target URL to benchmark
 * @param {number} count - The number of fetch requests to execute
 * @param {Function} [onProgress] - Optional callback fired after each request
 * @returns {Promise<Object>} An object containing the raw timeline and summary metrics
 */
export async function runBenchmark(url, count, onProgress) {
    const timeline = [];
    const responseTimes = [];

    for (let i = 1; i <= count; i++) {
        const start = performance.now();
        let success = false;
        let errorMsg = null;

        try {
            // cache: 'no-store' ensures we actually hit the network each time
            // mode: 'no-cors' is applied based on our design plan to avoid strict CORS blocks
            await fetch(url, { cache: 'no-store', mode: 'no-cors' });
            success = true;
        } catch (error) {
            errorMsg = error.message;
            console.error(`Request ${i} failed:`, errorMsg);
        }

        const end = performance.now();
        const duration = end - start;

        timeline.push({
            requestNumber: i,
            duration,
            success,
            error: errorMsg
        });

        if (success) {
            responseTimes.push(duration);
        }

        if (onProgress) {
            const currentMetrics = {
                mean: calculateMean(responseTimes),
                median: calculateMedian(responseTimes),
                p99: calculateP99(responseTimes)
            };
            
            onProgress({
                requestNumber: i,
                duration,
                success,
                error: errorMsg,
                metrics: currentMetrics
            });
        }

        if (i < count) {
            await new Promise(resolve => setTimeout(resolve, 50));
        }
    }

    return {
        url,
        totalRequests: count,
        successfulRequests: responseTimes.length,
        failedRequests: count - responseTimes.length,
        timeline,
        metrics: {
            mean: calculateMean(responseTimes),
            median: calculateMedian(responseTimes),
            p99: calculateP99(responseTimes)
        }
    };
}
