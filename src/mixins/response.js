export default {
	methods: {
		parseError(response) {
			let errorMsg = '';
			let errors = JSON.parse(response.data.error.message);
			
			Object.keys(errors).forEach(key => {
				errorMsg += `${errors[key].toString()}<br/>`;
			});
			
			return errorMsg;
		}
	}
}