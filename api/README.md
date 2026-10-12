# SurakshitPath - FastAPI Backend Service (PS-20)

This service provides the 4 REST API endpoints specified in the SurakshitPath System Architecture diagram (Box 2 & Box 6):

1. **Route Request API**: `POST /api/routes/calculate`
2. **Safety Scoring API**: `POST /api/safety/score`
3. **Safety Check API (Telemetry Watchdog)**: `POST /api/telemetry/check`
4. **Live Night Weather & Visibility API**: `GET /api/weather/pune`

## How to Run (Optional)
```bash
cd api
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
Interactive Swagger API Documentation will be available at: `http://localhost:8000/docs`.

*Note: The frontend web application is fully capable of running 100% client-side with zero dependencies on this Python server, using in-browser Dijkstra graph routing and IndexedDB vector caching.*
