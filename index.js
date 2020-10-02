const core = require('@actions/core');
const request = require('superagent');

(async () => {
	// Get the data
	const team_secret = core.getInput('team-secret', { required: true });
	let title = core.getInput('title');
	let message = core.getInput('message');
	let xS4Service = core.getInput('X-S4-Service');
	let xS4Location = core.getInput('X-S4-Location');
	let xS4AlertingScenario = core.getInput('X-S4-AlertingScenario');
	let xS4Filtering = core.getInput('X-S4-Filtering');
	let xS4ExternalID = core.getInput('X-S4-ExternalID');
	let xS4Status = core.getInput('X-S4-Status');

	let data;
	try {
		// Assemble the JSON data
		data = {
			'Title': title,
			'Message': message,
			'X-S4-Service': xS4Service,
			'X-S4-Location': xS4Location,
			'X-S4-AlertingScenario': xS4AlertingScenario,
			'X-S4-Filtering': xS4Filtering,
			'X-S4-ExternalID': xS4ExternalID,
			'X-S4-Status': xS4Status
		}
	} catch (err) {
		core.setFailed(`Invalid JSON format:`, err);
	return;
	}

	try {
		// Send request to SIGNL4
		const res = await request.post('https://connect.signl4.com/webhook/'+ team_secret).send(data);
			if (res.status < 200 || res.status > 299) {
				core.setFailed(`HTTP error: ${res.status}`);
			}
		// Get the response
		let json = JSON.parse(res.text);
		core.setOutput("eventId", json.eventId);
	} catch (error) {
		core.setFailed(error.message);
	}
})();
