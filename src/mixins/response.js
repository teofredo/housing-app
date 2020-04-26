export default {
	methods: {
		parseError(response) {
			try {
				let errorMsg = '';
				let errors = JSON.parse(response.data.error.message);
				
				Object.keys(errors).forEach(key => {
					errorMsg += `${errors[key].toString()}<br/>`;
				});
				
				return errorMsg;
			} catch(e) {}
			
			return response.data.error.message;
		}
	}
}