# Facebook Conversions API (CAPI) Example Server

This small Express server forwards client events to the Facebook Conversions API.

Important: do NOT commit your access token. Set it via environment variable.

Environment

- `FB_ACCESS_TOKEN` — access token for the Pixel (required)
- `FB_PIXEL_ID` — pixel id (defaults to 1609881127226703)
- `FB_TEST_EVENT_CODE` — optional test event code from Events Manager
- `PORT` — optional server port (default 3000)

Install & run

```bash
cd server
npm install
export FB_ACCESS_TOKEN="<your_token_here>"
export FB_PIXEL_ID="1609881127226703"
node server.js
```

Example request

```bash
curl -X POST http://localhost:3000/capi/events \
  -H "Content-Type: application/json" \
  -d '{
    "event_name":"Purchase",
    "event_time": 1710000000,
    "event_id":"YOUR_EVENT_ID",
    "custom_data":{"value":199.9,"currency":"BRL","content_ids":["sku123"]},
    "user_data": {"em":"hashed_email_here"}
  }'
```

Notes

- The server expects the client to send an `event_id` (we recommend using the same `event_id` used on the browser pixel) to allow deduplication.
- Do not paste your access token into source files. If you accidentally exposed the token, rotate it in Facebook's app settings.
- For production, secure this endpoint (authentication, rate limits) and send user_data hashed per Facebook requirements.
