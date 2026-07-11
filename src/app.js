import { runBenchmark } from './benchmark.js';

Chart.defaults.color = '#94a3b8';
Chart.defaults.font.family = "'Inter', sans-serif";
Chart.defaults.scale.grid.color = '#2a3441';

const ctx = document.getElementById('benchmarkChart').getContext('2d');
const chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Response Time (ms)',
            data: [],
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderWidth: 2,
            pointBackgroundColor: '#3b82f6',
            pointBorderColor: '#0b0f19',
            pointBorderWidth: 1,
            pointRadius: 4,
            pointHoverRadius: 6,
            tension: 0.2, // slight curve
            fill: true
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false, 
        interaction: {
            mode: 'index',
            intersect: false,
        },
        scales: {
            x: {
                title: { display: true, text: 'Request Sequence' }
            },
            y: {
                title: { display: true, text: 'Latency (ms)' },
                beginAtZero: true
            }
        },
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#1a2235',
                titleColor: '#f1f5f9',
                bodyColor: '#f1f5f9',
                borderColor: '#2a3441',
                borderWidth: 1,
                padding: 10,
                displayColors: false,
                callbacks: {
                    label: function(context) {
                        return `Latency: ${context.parsed.y.toFixed(2)} ms`;
                    }
                }
            },
            annotation: {
                annotations: {
                    lineMean: {
                        type: 'line',
                        yMin: 0, yMax: 0,
                        borderColor: '#ef4444',
                        borderWidth: 2,
                        borderDash: [4, 4],
                        label: { content: 'Mean', display: false, position: 'start', backgroundColor: '#ef4444', font: {family: 'Inter'} }
                    },
                    lineMedian: {
                        type: 'line',
                        yMin: 0, yMax: 0,
                        borderColor: '#10b981',
                        borderWidth: 2,
                        borderDash: [4, 4],
                        label: { content: 'Median', display: false, position: 'start', backgroundColor: '#10b981', font: {family: 'Inter'}, yAdjust: 20 }
                    },
                    lineP99: {
                        type: 'line',
                        yMin: 0, yMax: 0,
                        borderColor: '#f59e0b',
                        borderWidth: 2,
                        borderDash: [4, 4],
                        label: { content: 'P99', display: false, position: 'start', backgroundColor: '#f59e0b', font: {family: 'Inter'}, yAdjust: -20 }
                    }
                }
            }
        }
    }
});

const urlInput = document.getElementById('urlInput');
const countInput = document.getElementById('countInput');
const runBtn = document.getElementById('runBtn');
const btnText = document.querySelector('.btn-text');
const statusText = document.getElementById('statusText');

const valMean = document.getElementById('valMean');
const valMedian = document.getElementById('valMedian');
const valP99 = document.getElementById('valP99');

runBtn.addEventListener('click', async () => {
    const url = urlInput.value.trim();
    const count = parseInt(countInput.value, 10);

    if (!url || !count || count <= 0) return;

    // Reset UI & Chart for new run
    runBtn.disabled = true;
    runBtn.classList.add('loading');
    btnText.textContent = 'Running...';
    
    chart.data.labels = [];
    chart.data.datasets[0].data = [];
    
    const annotations = chart.options.plugins.annotation.annotations;
    annotations.lineMean.yMin = 0; annotations.lineMean.yMax = 0;
    annotations.lineMedian.yMin = 0; annotations.lineMedian.yMax = 0;
    annotations.lineP99.yMin = 0; annotations.lineP99.yMax = 0;
    
    chart.update();

    valMean.textContent = '0.00 ms';
    valMedian.textContent = '0.00 ms';
    valP99.textContent = '0.00 ms';

    await runBenchmark(url, count, (progress) => {
        statusText.textContent = `Fetching ${progress.requestNumber} of ${count}...`;
        
        chart.data.labels.push(progress.requestNumber);
        chart.data.datasets[0].data.push(progress.duration);

        if (progress.metrics.mean !== null) {
            valMean.textContent = progress.metrics.mean.toFixed(2) + ' ms';
            valMedian.textContent = progress.metrics.median.toFixed(2) + ' ms';
            valP99.textContent = progress.metrics.p99.toFixed(2) + ' ms';

            annotations.lineMean.yMin = progress.metrics.mean;
            annotations.lineMean.yMax = progress.metrics.mean;
            
            annotations.lineMedian.yMin = progress.metrics.median;
            annotations.lineMedian.yMax = progress.metrics.median;
            
            annotations.lineP99.yMin = progress.metrics.p99;
            annotations.lineP99.yMax = progress.metrics.p99;
        }

        chart.update();
    });

    statusText.textContent = 'Benchmark Complete';
    statusText.style.color = '#10b981';
    runBtn.disabled = false;
    runBtn.classList.remove('loading');
    btnText.textContent = 'Run Benchmark';
    
    setTimeout(() => {
        statusText.style.color = 'var(--text-muted)';
    }, 3000);
});
