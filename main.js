const { API_KEY } = process.env;

exports.handler = async function (event) {
const oppID = event.insightly.recordId;
let oppData = await getOppDataFromID(oppID)
let primaryContactID = null;
for (const field of oppData.CUSTOMFIELDS) {
    if (field.FIELD_NAME === 'Contact__c') {
        primaryContactID = field.FIELD_VALUE;
        break;
    }
}
let result = await linkContactToOpp(oppID, primaryContactID)
console.log(result)
async function linkContactToOpp(oppid, contactID) {
    try {
        let URL = `https://api.insightly.com/v3.1/Opportunity/${oppid}/Links`;
        let requestBody = {
            "OBJECT_NAME": "Opportunity",
            "OBJECT_ID": oppid,
            "LINK_OBJECT_NAME": "Contact",
            "LINK_OBJECT_ID": contactID
          };
        let response = await fetch(URL, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Basic ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });
        let responseData = await response.json();
		console.log("Link result "+responseData)
        return responseData;
    } catch (error) {
        console.error('Error:', error.message);
        return null;
    }
}
async function getOppDataFromID(oppID) {
    try {
        let URL = `https://api.na1.insightly.com/v3.1/Opportunities/` + oppID;
        let response = await fetch(URL, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization:
                `Basic ${API_KEY}`,
            },
        });
        let data = await response.json();
		console.log("get result "+data)
        return data;
    } catch (error) {
        console.error(
            "Error in getting the Opp Data, ID:" + id + " " + error.message
        );
        return null;
    }
}
return result
};