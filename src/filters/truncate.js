export default function(str, offset, limit) {
	if(str.length <= offset || str.length <= limit) {
		return str;
	}

	return str.substring(offset, limit) + '...';
}