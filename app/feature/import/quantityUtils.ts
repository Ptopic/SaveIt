export function parseQuantityString(qty: string): number | null {
	if (!qty || typeof qty !== 'string') return null;

	qty = qty.trim();

	if (/^\d*\.?\d+$/.test(qty)) {
		return parseFloat(qty);
	}

	const fractionMatch = qty.match(/^(\d+)\/(\d+)$/);
	if (fractionMatch) {
		const numerator = parseInt(fractionMatch[1], 10);
		const denominator = parseInt(fractionMatch[2], 10);
		if (denominator === 0) return null;
		return numerator / denominator;
	}

	const mixedMatch = qty.match(/^(\d+)\s+(\d+)\/(\d+)$/);
	if (mixedMatch) {
		const whole = parseInt(mixedMatch[1], 10);
		const numerator = parseInt(mixedMatch[2], 10);
		const denominator = parseInt(mixedMatch[3], 10);
		if (denominator === 0) return null;
		return whole + numerator / denominator;
	}

	const leadingNumberMatch = qty.match(/^(\d*\.?\d+|\d+\/\d+)/);
	if (leadingNumberMatch) {
		const extractedValue = leadingNumberMatch[0];
		if (extractedValue.includes('/')) {
			const [num, den] = extractedValue.split('/').map((n) => parseInt(n, 10));
			if (den === 0) return null;
			return num / den;
		}
		return parseFloat(extractedValue);
	}

	return null;
}

export function formatQuantity(value: number): string {
	if (isNaN(value) || value === null) return '';

	const rounded = Math.round(value * 100) / 100;

	return rounded.toFixed(1).replace(/\.0$/, '');
}

export function extractUnit(qty: string): string {
	if (!qty || typeof qty !== 'string') return '';

	const unitMatch = qty
		.replace(/^(\d*\.?\d+|\d+\/\d+|\d+\s+\d+\/\d+)/, '')
		.trim();

	return unitMatch;
}

export function formatQuantityWithUnit(
	value: number,
	originalQty: string
): string {
	if (isNaN(value) || value === null) return originalQty;

	const unit = extractUnit(originalQty);
	const formattedValue = formatQuantity(value);

	return unit ? `${formattedValue} ${unit}` : formattedValue;
}
