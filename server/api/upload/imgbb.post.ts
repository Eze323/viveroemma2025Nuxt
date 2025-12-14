import { defineEventHandler, readMultipartFormData, createError } from 'h3';

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const formData = await readMultipartFormData(event);

    if (!formData || formData.length === 0) {
        throw createError({
            statusCode: 400,
            statusMessage: 'No file provided',
        });
    }

    const file = formData.find((item) => item.name === 'image');
    if (!file) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Image file is missing',
        });
    }

    // Convert buffer to base64
    const base64Image = file.data.toString('base64');

    try {
        const response = await fetch('https://api.imgbb.com/1/upload', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                key: config.imgbbApiKey,
                image: base64Image,
            }),
        });

        const data = await response.json();

        if (!data.success) {
            throw createError({
                statusCode: 502,
                statusMessage: 'ImgBB upload failed: ' + (data.error?.message || 'Unknown error'),
            });
        }

        return {
            success: true,
            url: data.data.url,
            delete_url: data.data.delete_url,
        };
    } catch (error: any) {
        console.error('ImgBB upload error:', error);
        throw createError({
            statusCode: 500,
            statusMessage: error.message || 'Internal Server Error',
        });
    }
});
