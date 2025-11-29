import { describe, it, expect, vi, beforeEach } from 'vitest';
import { registerEndpoint } from '@nuxt/test-utils/runtime';
import { $fetch } from '@nuxt/test-utils/e2e'; // or runtime?

// We will use a unit test approach for the handler
import handler from '../../server/api/products/index.post';

// Mock dependencies
vi.mock('../../server/utils/drizzle', () => ({
    useDrizzle: vi.fn(() => ({
        insert: vi.fn().mockReturnThis(),
        values: vi.fn().mockResolvedValue([{ id: 1, name: 'Test Product' }]),
    })),
}));

vi.mock('../../server/utils/auth', () => ({
    requireAuth: vi.fn(),
}));

// Mock h3 readBody
vi.mock('h3', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual as any,
        readBody: vi.fn().mockResolvedValue({
            name: 'Test Product',
            category: 'Plants',
            precio_venta: 100,
            stock: 10,
        }),
    };
});

describe('POST /api/products', () => {
    it('should return success when valid data is provided', async () => {
        const event = {} as any; // Mock event
        const result = await handler(event);

        expect(result).toEqual({
            success: true,
            data: expect.objectContaining({
                message: 'Producto creado',
            }),
        });
    });
});
