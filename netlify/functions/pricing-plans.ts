import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { Client } from 'pg';
import { withCors, createDbClient, sendJSON, handleError, isAuthorized } from './utils';

const pricingPlansHandler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // Require authentication only for write operations; allow public GET
  if (
    ['POST', 'PUT', 'DELETE'].includes(event.httpMethod) &&
    !isAuthorized(event)
  ) {
    return sendJSON(401, { error: 'Unauthorized' });
  }

  const client = createDbClient();

  try {
    await client.connect();

    const pathParts = event.path.split('/').filter(part => part);
    const planId = pathParts[pathParts.length - 1];

    switch (event.httpMethod) {
      case 'GET':
        return await handleGet(client, planId);

      case 'POST':
        return await handlePost(client, event.body);

      case 'PUT':
        return await handlePut(client, event.body, planId);

      case 'DELETE':
        return await handleDelete(client, planId);

      default:
        return sendJSON(405, { error: 'Method not allowed' });
    }
  } catch (error) {
    return handleError(error, 'Pricing plans');
  } finally {
    await client.end();
  }
};

const handleGet = async (client: Client, planId: string) => {
  if (planId && planId !== 'pricing-plans') {
    const result = await client.query(
      'SELECT * FROM pricing_plans WHERE id = $1',
      [planId]
    );

    if (result.rows.length === 0) {
        return sendJSON(404, { error: 'Pricing plan not found' });
    }

    return sendJSON(200, {
      success: true,
      data: result.rows[0]
    });
  } else {
    const result = await client.query(
      'SELECT * FROM pricing_plans ORDER BY sort_order ASC'
    );

    return sendJSON(200, {
      success: true,
      data: result.rows
    });
  }
};

const handlePost = async (client: Client, body: string | null) => {
  if (!body) {
    return sendJSON(400, { error: 'Request body required' });
  }

  const { 
    section_id, 
    name, 
    price, 
    period, 
    description, 
    features, 
    button_text, 
    button_link,
    is_popular = false, 
    sort_order = 0,
    is_coming_soon = true // Default to Coming Soon state
  } = JSON.parse(body);

  if (!section_id || !name || !price || !button_text || !features) {
    return sendJSON(400, { 
      error: 'section_id, name, price, button_text, and features are required' 
    });
  }

  const result = await client.query(
    `INSERT INTO pricing_plans (section_id, name, price, period, description, features, button_text, button_link, is_popular, sort_order, is_coming_soon)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
    [section_id, name, price, period, description, JSON.stringify(features), button_text, button_link, is_popular, sort_order, is_coming_soon]
  );

  return sendJSON(201, {
    success: true,
    data: result.rows[0]
  });
};

const handlePut = async (client: Client, body: string | null, planId: string) => {
  if (!body) {
    return sendJSON(400, { error: 'Request body required' });
  }

  const id = parseInt(planId);
  if (isNaN(id)) {
    return sendJSON(400, { error: 'Invalid pricing plan ID' });
  }

  const { name, price, period, description, features, button_text, button_link, is_popular, sort_order, is_coming_soon } = JSON.parse(body);
  const updates: string[] = [];
  const values: any[] = [];
  let valueIndex = 1;

  if (name !== undefined) {
    updates.push(`name = $${valueIndex++}`);
    values.push(name);
  }

  if (price !== undefined) {
    updates.push(`price = $${valueIndex++}`);
    values.push(price);
  }

  if (period !== undefined) {
    updates.push(`period = $${valueIndex++}`);
    values.push(period);
  }

  if (description !== undefined) {
    updates.push(`description = $${valueIndex++}`);
    values.push(description);
  }

  if (features !== undefined) {
    updates.push(`features = $${valueIndex++}`);
    values.push(JSON.stringify(features));
  }

  if (button_text !== undefined) {
    updates.push(`button_text = $${valueIndex++}`);
    values.push(button_text);
  }

  if (button_link !== undefined) {
    updates.push(`button_link = $${valueIndex++}`);
    values.push(button_link);
  }

  if (is_popular !== undefined) {
    updates.push(`is_popular = $${valueIndex++}`);
    values.push(is_popular);
  }

  if (sort_order !== undefined) {
    updates.push(`sort_order = $${valueIndex++}`);
    values.push(sort_order);
  }

  if (is_coming_soon !== undefined) {
    updates.push(`is_coming_soon = $${valueIndex++}`);
    values.push(is_coming_soon);
  }

  updates.push(`updated_at = CURRENT_TIMESTAMP`);
  values.push(id);

  const result = await client.query(
    `UPDATE pricing_plans SET ${updates.join(', ')} WHERE id = $${valueIndex} RETURNING *`,
    values
  );

  if (result.rows.length === 0) {
      return sendJSON(404, { error: 'Pricing plan not found' });
  }

  return sendJSON(200, {
    success: true,
    data: result.rows[0]
  });
};

const handleDelete = async (client: Client, planId: string) => {
  const id = parseInt(planId);
  if (isNaN(id)) {
    return sendJSON(400, { error: 'Invalid pricing plan ID' });
  }

  const result = await client.query(
    'DELETE FROM pricing_plans WHERE id = $1 RETURNING *',
    [id]
  );

  if (result.rows.length === 0) {
      return sendJSON(404, { error: 'Pricing plan not found' });
  }

  return sendJSON(200, {
    success: true,
    message: 'Pricing plan deleted successfully'
  });
};

export const handler = withCors(pricingPlansHandler);