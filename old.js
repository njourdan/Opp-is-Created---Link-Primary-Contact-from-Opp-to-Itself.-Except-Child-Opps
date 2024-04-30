const { stringify } = JSON;
const { API_KEY } = process.env;
const { api, log, init, field, newLink } = require('./insightly');

exports.handler = async function (event) {
    init(API_KEY);
    log(`BEGIN LINKED OPP HANDLER`);
    let result = true;

    const { insightly: { newValue: { OPPORTUNITY_ID, CATEGORY_ID } } } = event;
    log(`event =`, event);

    const opportunity = await api(`opportunities/${OPPORTUNITY_ID}`);
    log(`opportunity = ${stringify(opportunity)}`);
    if (!opportunity) return 'No opportunity found';

    // Get primary opp id
    let primaryOpportunityId = await field(opportunity, 'Primary_Opportunity__c');
    if (!primaryOpportunityId) return 'No primary opportunity id found';
    log(`primary opportunity id = ${primaryOpportunityId}`);

    // Get primary opp by id
    const primaryOpportunity = await api(`opportunities/${primaryOpportunityId}`);
    if (!primaryOpportunity) return 'No primary opportunity found';
    log(`primary opportunity = ${stringify(primaryOpportunity)}`);

    // Get primary opp org id
    let primaryOppOrgId = primaryOpportunity.ORGANISATION_ID;
    if (!primaryOppOrgId) return 'No primary opportunity organization id found';
    log(`Primary opportunity org id ${primaryOppOrgId}`);

    // Get primary opp contact id
    let primaryOppContactId = await field(primaryOpportunity, 'Contact__c');
    if (!primaryOppContactId) return 'No primary opportunity contact id found';
    log(`Primary opportunity contact id ${primaryOppContactId}`);

    // Set linked opp contact and org ids
    await api(`opportunities/${OPPORTUNITY_ID}`, 'PUT', {
        OPPORTUNITY_ID,
        ORGANISATION_ID: primaryOppOrgId,
        CUSTOMFIELDS: [{ FIELD_NAME: 'Contact__c', FIELD_VALUE: primaryOppContactId }]
    });

    // Create a link for opportunity contact
    await api(
        `opportunities/${OPPORTUNITY_ID}/links`, 'POST',
        newLink('Opportunity', OPPORTUNITY_ID, 'Contact', primaryOppContactId)
    );

    log(`Linked opportunity ${OPPORTUNITY_ID} set contact to ${primaryOppContactId} and org to ${primaryOppOrgId}`);
    result = true;

    log(`END LINKED OPP HANDLER`, result);
    return result;
};