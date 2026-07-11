import { describe, it, expect, vi } from 'vitest';
import { runBenchmark } from '../src/benchmark.js';

describe('Live URL Benchmark Runner', () => {
    
    // We increase the timeout to 10000ms (10s) because network requests take time
    it('should successfully execute the benchmark against a live URL', async () => {
        const TARGET_URL = 'https://jsonplaceholder.typicode.com/posts/1';
        const REQUEST_COUNT = 5;

        console.log(`\n🚀 Vitest: Starting benchmark against ${TARGET_URL}...`);
        
        const onProgress = vi.fn();
        const results = await runBenchmark(TARGET_URL, REQUEST_COUNT, onProgress);
        
        console.log('\n📊 Vitest: Benchmark Completed! Data object:');
        console.dir(results, { depth: null });

        // Verify the benchmark callback fired correctly
        expect(onProgress).toHaveBeenCalledTimes(REQUEST_COUNT);
        
        // Verify the benchmark function returns the expected object structure
        expect(results).toBeDefined();
        expect(results.url).toBe(TARGET_URL);
        expect(results.totalRequests).toBe(REQUEST_COUNT);
        // The timeline array should have exactly the number of requests we made
        expect(results.timeline).toHaveLength(REQUEST_COUNT);
        
        // Ensure metrics are calculated
        expect(results.metrics).toHaveProperty('mean');
        expect(results.metrics).toHaveProperty('median');
        expect(results.metrics).toHaveProperty('p99');
        
        // Ensure that at least some requests were successful (if the API is up)
        expect(results.successfulRequests).toBeGreaterThan(0);
        
    }, 10000); // 10 second timeout for this specific test
});
