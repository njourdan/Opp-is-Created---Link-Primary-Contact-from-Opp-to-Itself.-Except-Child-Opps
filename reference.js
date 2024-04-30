const { stringify } = JSON;
const { API_KEY } = process.env;
const { api, log, init, field, newLink } = require('./insightly');

exports.handler = async function (event) {
    init(API_KEY);
    log(`BEGIN LINKED OPP HANDLER`);
    let result = true;
    // configuring oppID for use
    const { insightly: { newValue: { OPPORTUNITY_ID } } } = event;
    log(`event =`, event);

    const opportunity = await api(`opportunities/${OPPORTUNITY_ID}`);
    log(`opportunity = ${stringify(opportunity)}`);
    if (!opportunity) return 'No opportunity found';

    // Get primaryContactID from the opportunity object for linking
    let primaryContactID = await field(opportunity, 'Contact__c');
    if (!primaryContactID) return 'No Primary Contact found';
    log(`primary opportunity id = ${primaryContactID}`);

    // Create a link for opportunity primary contact
    await api(
        `opportunities/${OPPORTUNITY_ID}/links`, 'POST',
        newLink('Opportunity', OPPORTUNITY_ID, 'Contact', primaryContactID)
    );

    log(`Linked opportunity ${OPPORTUNITY_ID} set contact to ${primaryContactID}`);
    result = true;

    log(`END LINKED OPP HANDLER`, result);
    return result;
};