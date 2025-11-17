import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './',
    fullyParallel: true,
    reporter: [['html', { open: 'never' }]],
    timeout: 30 * 1000,

    projects: [
        {
            name: 'frontend',
            testDir: 'frontend',
            use: {
                baseURL: 'http://localhost:3000', // porta do frontend
                browserName: 'chromium',
                headless: true,
            },
        },
        {
            name: 'backend',
            testDir: 'backend',
            use: {
                baseURL: 'http://localhost:8080', // porta do seu backend
                extraHTTPHeaders: {
                    'Content-Type': 'application/json',
                },
            },
        },
    ],
});
