import { z } from '@nuxt/content'
import {defineContentConfig, defineCollection} from '@nuxt/content'

export default defineContentConfig({
    collections: {
        content: defineCollection({
            type:'page',
            source: '**/*.md',
            schema: z.object({
                title: z.string().min(1).max(100),
                description: z.string().max(500).optional(),
                date: z.string().datetime().optional(),      
        }),
        }),

    }
})