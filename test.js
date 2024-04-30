require('dotenv').config()
async function checkSIGMAGroupRelatedTaskField(taskID) {
    try {
        let URL = `https://api.insightly.com/v3.1/Tasks/${taskID}`;
        let requestBody = {
            "TASK_ID": taskID,
            "CUSTOMFIELDS": [
                {
                    "FIELD_NAME": 'SIGMA_Group_Related_Task__c',
                    "FIELD_VALUE": true,
                    "CUSTOM_FIELD_ID": 'SIGMA_Group_Related_Task__c'
                  }
            ]
          };
        let response = await fetch(URL, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Authorization' : `Basic ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });
        let responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}
async function opp(ID) {
    try {
        let URL = `https://api.insightly.com/v3.1/Opportunity/${ID}`;
        let response = await fetch(URL, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization' : `Basic ${process.env.API_KEY}`,
            },
        });
        let responseData = await response.json();
        console.log(responseData)
        return responseData;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}
let data = opp(40202731)