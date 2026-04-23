const resolveProductImages = ({ id, name, images } = {}) => {
	if (Array.isArray(images) && images.length > 0) {
		return images;
	}

	if (!id && !name) {
		return [];
	}

	const slug = String(name || id || '')
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, '-');

	if (!slug) {
		return [];
	}

	return [`/images/products/${slug}.jpg`];
};

export default resolveProductImages;
