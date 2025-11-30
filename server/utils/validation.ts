// server/utils/validation.ts
import { H3Error } from 'h3'

export class ValidationError extends Error {
    statusCode: number

    constructor(message: string) {
        super(message)
        this.name = 'ValidationError'
        this.statusCode = 400
    }
}

/**
 * Sanitize string input
 */
export const sanitizeString = (input: string): string => {
    return input.trim().replace(/<[^>]*>/g, '')
}

/**
 * Validate required field
 */
export const validateRequired = (value: any, fieldName: string): void => {
    if (value === undefined || value === null || value === '') {
        throw new ValidationError(`${fieldName} es requerido`)
    }
}

/**
 * Validate positive number
 */
export const validatePositiveNumber = (value: number, fieldName: string): void => {
    if (typeof value !== 'number' || isNaN(value) || value < 0) {
        throw new ValidationError(`${fieldName} debe ser un número positivo`)
    }
}

/**
 * Validate non-negative number
 */
export const validateNonNegativeNumber = (value: number, fieldName: string): void => {
    if (typeof value !== 'number' || isNaN(value) || value < 0) {
        throw new ValidationError(`${fieldName} no puede ser negativo`)
    }
}

/**
 * Validate string length
 */
export const validateStringLength = (
    value: string,
    fieldName: string,
    min: number = 0,
    max: number = 255
): void => {
    if (typeof value !== 'string') {
        throw new ValidationError(`${fieldName} debe ser un texto`)
    }

    const length = value.trim().length

    if (length < min) {
        throw new ValidationError(`${fieldName} debe tener al menos ${min} caracteres`)
    }

    if (length > max) {
        throw new ValidationError(`${fieldName} no puede exceder ${max} caracteres`)
    }
}

/**
 * Validate email format
 */
export const validateEmail = (email: string): void => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
        throw new ValidationError('Email inválido')
    }
}

/**
 * Validate product data
 */
export const validateProductData = (data: any): void => {
    // Required fields
    validateRequired(data.name, 'Nombre')
    validateRequired(data.category, 'Categoría')
    validateRequired(data.precio_venta, 'Precio de venta')
    validateRequired(data.stock, 'Stock')

    // Sanitize strings
    data.name = sanitizeString(data.name)
    if (data.description) {
        data.description = sanitizeString(data.description)
    }

    // Validate lengths
    validateStringLength(data.name, 'Nombre', 1, 255)
    if (data.description) {
        validateStringLength(data.description, 'Descripción', 0, 500)
    }

    // Validate numbers
    validatePositiveNumber(Number(data.precio_venta), 'Precio de venta')
    validateNonNegativeNumber(Number(data.stock), 'Stock')

    if (data.precio_compra !== undefined && data.precio_compra !== null) {
        validateNonNegativeNumber(Number(data.precio_compra), 'Precio de compra')
    }

    // Validate category
    const validCategories = ['planta', 'arbusto', 'plantin', 'otro', 'semilla', 'herramienta']
    if (!validCategories.includes(data.category)) {
        throw new ValidationError('Categoría inválida')
    }
}

/**
 * Validate sale data
 */
export const validateSaleData = (data: any): void => {
    // Required fields
    validateRequired(data.customer, 'Cliente')
    validateRequired(data.items, 'Items')

    // Sanitize customer name
    data.customer = sanitizeString(data.customer)
    validateStringLength(data.customer, 'Cliente', 1, 255)

    // Validate items array
    if (!Array.isArray(data.items) || data.items.length === 0) {
        throw new ValidationError('Debe incluir al menos un producto')
    }

    // Validate each item
    data.items.forEach((item: any, index: number) => {
        validateRequired(item.productId, `Item ${index + 1}: ID de producto`)
        validateRequired(item.quantity, `Item ${index + 1}: Cantidad`)
        validateRequired(item.unitPrice, `Item ${index + 1}: Precio unitario`)

        validatePositiveNumber(Number(item.quantity), `Item ${index + 1}: Cantidad`)
        validatePositiveNumber(Number(item.unitPrice), `Item ${index + 1}: Precio unitario`)
    })
}

/**
 * Calculate sale totals (server-side calculation)
 */
export const calculateSaleTotals = (items: any[], ivaRate: number = 0.21) => {
    const subtotal = items.reduce((sum, item) => {
        return sum + (Number(item.quantity) * Number(item.unitPrice))
    }, 0)

    const iva = subtotal * ivaRate
    const total = subtotal + iva

    return {
        subtotal: Number(subtotal.toFixed(2)),
        iva: Number(iva.toFixed(2)),
        total: Number(total.toFixed(2))
    }
}
