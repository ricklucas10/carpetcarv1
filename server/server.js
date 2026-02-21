const express = require('express');
const fetch = require('node-fetch');
const app = express();
app.use(express.json());

const FB_ACCESS_TOKEN = process.env.FB_ACCESS_TOKEN;
const FB_PIXEL_ID = process.env.FB_PIXEL_ID || '1609881127226703';
const TEST_EVENT_CODE = process.env.FB_TEST_EVENT_CODE;

if (!FB_ACCESS_TOKEN) {
  console.warn('Warning: FB_ACCESS_TOKEN is not set. CAPI requests will fail until you set it.');
}

app.post('/capi/events', async (req, res) => {
  try {
    const { event_name, event_time, event_id, custom_data, event_source_url, user_data } = req.body;
    if (!event_name || !event_time) return res.status(400).json({ error: 'event_name and event_time required' });

    const payload = {
      data: [
        {
          event_name,
          event_time,
          event_id,
          event_source_url,
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

    const body = await fbRes.json();
    if (!fbRes.ok) return res.status(502).json({ error: 'facebook_error', details: body });
    return res.json(body);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server_error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`CAPI proxy listening on port ${PORT}`));
