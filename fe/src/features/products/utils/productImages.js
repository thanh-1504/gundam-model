const normalizeImageUrl = (image) => {
	if (!image) {
		return null;
	}

	if (typeof image === 'string') {
		const trimmed = image.trim();
		if (!trimmed) {
			return null;
		}

		if (/^(https?:|data:|blob:|\/)/i.test(trimmed)) {
			return trimmed;
		}

		return trimmed;
	}

	if (typeof image === 'object') {
		return normalizeImageUrl(image.image_url || image.url || image.path);
	}

	return null;
};

const resolveProductImages = ({ images } = {}) => {
	if (!Array.isArray(images)) {
		return [];
	}

	return images.map(normalizeImageUrl).filter(Boolean);
};

export default resolveProductImages;
