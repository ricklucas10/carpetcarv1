export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' });

  const FB_ACCESS_TOKEN = process.env.FB_ACCESS_TOKEN;
  const FB_PIXEL_ID = process.env.FB_PIXEL_ID || '1609881127226703';
  const TEST_EVENT_CODE = process.env.FB_TEST_EVENT_CODE;

  if (!FB_ACCESS_TOKEN) return res.status(500).json({ error: 'FB_ACCESS_TOKEN not set' });

  try {
    const { event_name, event_time, event_id, custom_data, user_data, event_source_url } = req.body || {};
    if (!event_name || !event_time) return res.status(400).json({ error: 'event_name and event_time required' });

    const payload = {
      data: [
        {
          event_name,
          event_time,
          event_id,
          event_source_url: event_source_url || req.headers.referer || null,
          user_data: user_data || {},
          custom_data: custom_data || {}
        }
      ],
      access_token: FB_ACCESS_TOKEN
    };

    let url = `https://graph.facebook.com/v13.0/${FB_PIXEL_ID}/events`;
    if (TEST_EVENT_CODE) url += `?test_event_code=${encodeURIComponent(TEST_EVENT_CODE)}`;

    const fbRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const json = await fbRes.json();
    if (!fbRes.ok) return res.status(502).json({ error: 'facebook_error', details: json });
    return res.status(200).json(json);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'server_error' });
  }
}
