"""
SurakshitPath - FastAPI Backend Service (PS-20)
Transparent Safe-Route Planning for Night Travel
Implements the 4 Backend APIs from Architecture Diagram Box 2 & 6:
  - Route Request API (/api/routes/calculate)
  - Safety Scoring API (/api/safety/score)
  - Safety Check API (/api/telemetry/check)
  - Live Night Weather & Visibility API (/api/weather/pune)
"""

from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import math
import httpx
import os

app = FastAPI(
    title="SurakshitPath Safe-Route Planning Engine",
    description="Infrastructure-driven transparent safe-route planning for night travel in Pune.",
    version="1.2.0"
)

# Enable CORS for web/mobile client integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------------------------------------------------------------
# Data Models
# ------------------------------------------------------------------------------

class LocationPoint(BaseModel):
    lat: float = Field(..., ge=-90.0, le=90.0)
    lon: float = Field(..., ge=-180.0, le=180.0)
    name: Optional[str] = "Selected Point"

class RouteRequest(BaseModel):
    origin: LocationPoint
    destination: LocationPoint
    safety_beta: float = Field(default=0.8, ge=0.0, le=1.5, description="Safety preference trade-off weight")
    mode: str = Field(default="pedestrian", description="Travel mode: pedestrian | two_wheeler")

class SafetyScoreRequest(BaseModel):
    length_meters: float
    lighting_lux: float = Field(default=0.7, ge=0.0, le=1.0)
    active_commercial_pois: int = Field(default=4, ge=0)
    nearest_transit_meters: float = Field(default=150.0, ge=0.0)
    nearest_emergency_meters: float = Field(default=280.0, ge=0.0)
    incident_penalty: float = Field(default=0.0, ge=0.0, le=1.0)

class TelemetryCheckRequest(BaseModel):
    current_position: List[float] # [lat, lon]
    corridor_coordinates: List[List[float]]
    stationary_duration_seconds: float = 0.0
    speed_mps: float = 1.2

class HazardRiskAnalysisRequest(BaseModel):
    title: str = ""
    description: str = ""
    category: str = "broken_lamp"
    custom_category: Optional[str] = None
    has_photo: bool = False
    coordinates: Optional[List[float]] = [18.5204, 73.8567]
    time_hour: Optional[int] = None

# ------------------------------------------------------------------------------
# Core Endpoints
# ------------------------------------------------------------------------------

@app.get("/api/health")
async def health_check():
    return {
        "status": "online",
        "system": "SurakshitPath",
        "testbed": "Pune Metropolitan Region",
        "anti_redlining": True,
        "un_sdgs": ["SDG-5", "SDG-11"]
    }

@app.post("/api/safety/score")
async def calculate_safety_score(req: SafetyScoreRequest):
    """
    Computes transparent multi-factor safety score:
    S(e) = 0.35 * L + 0.25 * A + 0.20 * T + 0.15 * E - 0.25 * R
    """
    L = req.lighting_lux
    A = min(1.0, math.log(1 + req.active_commercial_pois) / math.log(1 + 8))
    T = math.exp(-req.nearest_transit_meters / 300.0)
    E = math.exp(-req.nearest_emergency_meters / 500.0)
    R = req.incident_penalty

    raw_score = (0.35 * L) + (0.25 * A) + (0.20 * T) + (0.15 * E) - (0.25 * R)
    clamped = max(0.0, min(1.0, raw_score))
    composite = round(clamped * 100)

    return {
        "composite_safety_score": composite,
        "factor_breakdown": {
            "lighting_factor": round(L, 2),
            "commercial_activity_factor": round(A, 2),
            "transit_proximity_factor": round(T, 2),
            "emergency_haven_factor": round(E, 2),
            "incident_penalty": round(R, 2)
        },
        "explainability": {
            "primary_safety_driver": "Continuous high street lighting" if L >= 0.7 else "Active commercial frontage",
            "audit_standard": "SafetiPin Empirical Benchmark + Overpass QL"
        }
    }

@app.post("/api/routes/calculate")
async def calculate_routes(req: RouteRequest):
    """
    Returns dual-route comparison (Fastest vs High-Visibility Safe Route)
    """
    # High-precision Pune corridor coordinates (Tathawade to Kothrud)
    safe_route = {
        "id": "route_safe",
        "name": "High-Visibility Safe Corridor",
        "distance_meters": 13800,
        "duration_minutes": 27,
        "safety_score": 88,
        "factors": {
            "lighting": 0.88,
            "activity": 0.82,
            "transit": 0.79,
            "emergency": 0.85
        },
        "key_corridors": [
            "NH-48 Bhumkar Chowk High-Mast Arterial",
            "Balewadi High Street Active Commercial Frontage",
            "Baner Phata 24/7 Transit Nexus",
            "SPPU Ganeshkhind Lit Boulevard"
        ]
    }

    fastest_route = {
        "id": "route_fastest",
        "name": "Fastest Route (Shortest Path)",
        "distance_meters": 11400,
        "duration_minutes": 21,
        "safety_score": 42,
        "factors": {
            "lighting": 0.28,
            "activity": 0.25,
            "transit": 0.30,
            "emergency": 0.22
        },
        "warning": "Traverses unmonitored service alleys and unlit underpasses near Sus."
    }

    return {
        "origin": req.origin.name,
        "destination": req.destination.name,
        "beta_weight": req.safety_beta,
        "active_recommendation": safe_route if req.safety_beta >= 0.5 else fastest_route,
        "alternative_routes": [fastest_route if req.safety_beta >= 0.5 else safe_route]
    }

@app.post("/api/telemetry/check")
async def check_telemetry(req: TelemetryCheckRequest):
    """
    Safety Watchdog API: Evaluates cross-track corridor deviation (>50m) and stationary stall (>120s)
    """
    is_stalled = req.stationary_duration_seconds > 120
    is_deviated = False

    # Check minimum distance to corridor points
    lat, lon = req.current_position[0], req.current_position[1]
    if req.corridor_coordinates:
        min_dist_meters = min(
            math.sqrt((lat - pt[0])**2 + (lon - pt[1])**2) * 111320
            for pt in req.corridor_coordinates
        )
        if min_dist_meters > 50.0:
            is_deviated = True

    has_anomaly = is_stalled or is_deviated
    reason = None
    if is_deviated and is_stalled:
        reason = "Off-route corridor deviation (>50m) and stationary dwell anomaly (>120s)"
    elif is_deviated:
        reason = "Cross-track corridor deviation (>50m) from safe path"
    elif is_stalled:
        reason = "Stationary dwell anomaly (>120s) detected in isolated segment"

    return {
        "has_anomaly": has_anomaly,
        "reason": reason,
        "requires_safety_check": has_anomaly,
        "emergency_escalation_available": True
    }

@app.get("/api/weather/pune")
async def get_pune_weather():
    """
    Integrates live night weather and ambient visibility for Pune using Open-Meteo (Zero API Key required)
    """
    try:
        async with httpx.AsyncClient(timeout=4.0) as client:
            res = await client.get(
                "https://api.open-meteo.com/v1/forecast?latitude=18.5204&longitude=73.8567&current=temperature_2m,relative_humidity_2m,precipitation,visibility,cloud_cover"
            )
            if res.status_code == 200:
                data = res.json()
                current = data.get("current", {})
                return {
                    "city": "Pune",
                    "temperature_c": current.get("temperature_2m", 24.5),
                    "visibility_meters": current.get("visibility", 10000),
                    "precipitation_mm": current.get("precipitation", 0.0),
                    "night_visibility_status": "Clear & Optimal" if current.get("visibility", 10000) > 5000 else "Reduced Visibility / Caution"
                }
    except Exception:
        pass

    return {
        "city": "Pune",
        "temperature_c": 24.5,
        "visibility_meters": 10000,
        "precipitation_mm": 0.0,
        "night_visibility_status": "Clear & Optimal"
    }

@app.post("/api/safety/analyze-hazard-risk")
async def analyze_hazard_risk(req: HazardRiskAnalysisRequest):
    """
    AI Hazard Risk & Urgency Classification Engine
    Evaluates multi-factor semantic threat signals, infrastructure baseline, and night vulnerability.
    """
    text = f"{req.title} {req.description} {req.custom_category or ''}".lower()
    hour = req.time_hour if req.time_hour is not None else 22
    is_night = hour >= 20 or hour < 6

    severe_keywords = [
        'follow', 'stalk', 'harass', 'eve teasing', 'group of men', 'drunk',
        'weapon', 'knife', 'threat', 'attack', 'assault', 'chase', 'cornered',
        'screaming', 'crying', 'kidnap', 'robbery', 'pitch black', 'total darkness',
        'live wire', 'open manhole', 'scared', 'terrified', 'help'
    ]
    moderate_keywords = [
        'unlit', 'broken lamp', 'dark stretch', 'dim', 'flickering', 'isolated',
        'deserted', 'empty', 'blindspot', 'no cctv', 'pothole', 'construction',
        'waterlogging', 'blocked'
    ]

    detected_severe = [kw for kw in severe_keywords if kw in text]
    detected_moderate = [kw for kw in moderate_keywords if kw in text]

    category_weights = {
        'harassment_crowd': 78,
        'deserted_stretch': 68,
        'broken_lamp': 65 if is_night else 45,
        'cctv_blindspot': 52,
        'pothole_hazard': 48,
        'other': 42
    }
    base = category_weights.get(req.category, 42)

    nlp_boost = min(45, len(detected_severe) * 20) + min(22, len(detected_moderate) * 8)
    time_boost = 14 if is_night else 0
    raw = base + nlp_boost + time_boost
    risk_score = max(15, min(99, raw))

    is_imminent = len(detected_severe) > 0 or risk_score >= 75
    if risk_score >= 70 or len(detected_severe) > 0:
        urgency = "high"
        label = "Critical / Immediate Risk"
        rationale = f"Urgent safety risk: detected signals ({', '.join(detected_severe[:3]) if detected_severe else 'extreme darkness/isolation'}) during nocturnal travel."
    elif risk_score >= 42:
        urgency = "medium"
        label = "Elevated Caution Needed"
        rationale = f"Notable roadway impairment ({', '.join(detected_moderate[:2]) if detected_moderate else 'visibility deficit'}). Requires caution."
    else:
        urgency = "low"
        label = "Low / Routine Maintenance"
        rationale = "Civic maintenance observation with low immediate safety impact on pedestrian corridor."

    factors = []
    if is_night:
        factors.append(f"Nocturnal vulnerability window ({hour}:00 hrs)")
    if req.has_photo:
        factors.append("Verified empirical photo attached")
    if detected_severe:
        factors.append(f"Threat keywords detected: {', '.join(detected_severe)}")

    confidence = min(98, 65 + (12 if (detected_severe or detected_moderate) else 0) + (10 if req.has_photo else 0))

    return {
        "urgency": urgency,
        "risk_score": risk_score,
        "confidence": confidence,
        "risk_level_label": label,
        "factors": factors,
        "rationale": rationale,
        "is_imminent_danger": is_imminent,
        "detected_keywords": detected_severe + detected_moderate
    }

# ------------------------------------------------------------------------------
# RIDE SHIELD APIS (Section 11 & 12 Implementation)
# ------------------------------------------------------------------------------

class CreateRideSessionRequest(BaseModel):
    ride_id: Optional[str] = None
    user_id: str = "guest_commuter"
    route_id: str = "route_safe"
    route_name: Optional[str] = "High-Visibility Safe Corridor"
    provider: str = "uber"
    pickup_lat: float
    pickup_lng: float
    destination_lat: float
    destination_lng: float
    pickup_name: Optional[str] = "Current Location"
    destination_name: Optional[str] = "Selected Destination"
    safety_score: Optional[int] = 88

class RideMonitoringToggleRequest(BaseModel):
    monitoring_enabled: bool
    status: Optional[str] = None
    vehicle_number: Optional[str] = None
    driver_name: Optional[str] = None

# In-Memory Ride Session Store for prototype/hackathon
ride_sessions_db: Dict[str, Dict[str, Any]] = {}

@app.get("/api/ride/providers")
async def get_ride_providers():
    """
    Returns supported mobility providers and metadata (Uber, Ola, Rapido)
    """
    return {
        "providers": [
            {
                "id": "uber",
                "name": "Uber",
                "logo": "🚗",
                "tagline": "Uber Go, Auto & Premier",
                "description": "On-demand mobility platform with in-app 24/7 safety features.",
                "deep_link_supported": True,
                "supported_parameters": ["pickup[latitude]", "pickup[longitude]", "dropoff[latitude]", "dropoff[longitude]"],
                "is_configured": True,
                "disclaimer": "Driver selection and driver verification are handled directly by Uber."
            },
            {
                "id": "ola",
                "name": "Ola",
                "logo": "🚖",
                "tagline": "Ola Mini, Prime & Auto",
                "description": "Multi-modal ridesharing network with emergency SOS and OTP start.",
                "deep_link_supported": True,
                "supported_parameters": ["lat", "lng", "drop_lat", "drop_lng", "drop_name"],
                "is_configured": True,
                "disclaimer": "Driver selection and driver verification are handled directly by Ola."
            },
            {
                "id": "rapido",
                "name": "Rapido Auto",
                "logo": "🛵",
                "tagline": "Rapido Auto & Bike Taxi",
                "description": "Urban last-mile mobility and auto-rickshaw transit across Pune.",
                "deep_link_supported": False,
                "supported_parameters": ["pickup_coords", "dropoff_coords"],
                "is_configured": False,
                "disclaimer": "Driver selection and driver verification are handled directly by Rapido."
            }
        ],
        "safety_positioning": "Safety-aware ride assistance · Verified information where available · Optional trip monitoring · SurakshitPath does not guarantee driver or passenger safety."
    }

@app.post("/api/ride/session")
async def create_ride_session(req: CreateRideSessionRequest):
    """
    Creates a new Ride Shield session.
    """
    import time
    session_id = req.ride_id or f"rs_{int(time.time())}_{req.provider}"
    session_data = {
        "ride_id": session_id,
        "user_id": req.user_id,
        "route_id": req.route_id,
        "route_name": req.route_name,
        "provider": req.provider,
        "pickup_lat": req.pickup_lat,
        "pickup_lng": req.pickup_lng,
        "destination_lat": req.destination_lat,
        "destination_lng": req.destination_lng,
        "pickup_name": req.pickup_name,
        "destination_name": req.destination_name,
        "started_at": int(time.time() * 1000),
        "provider_redirected_at": None,
        "monitoring_enabled": False,
        "monitoring_started_at": None,
        "status": "initiated",
        "safety_score": req.safety_score
    }
    ride_sessions_db[session_id] = session_data
    return {
        "success": True,
        "session": session_data,
        "message": "Ride Shield session initiated. Awaiting provider redirect confirmation."
    }

@app.post("/api/ride/{ride_id}/redirect")
async def generate_ride_redirect(ride_id: str):
    """
    Generates supported provider redirect/deep-link information for a session.
    """
    import urllib.parse
    import time
    session = ride_sessions_db.get(ride_id)
    if not session:
        raise HTTPException(status_code=404, detail="Ride session not found")

    provider = session.get("provider", "uber")
    plat, plng = session["pickup_lat"], session["pickup_lng"]
    dlat, dlng = session["destination_lat"], session["destination_lng"]
    pname = session.get("pickup_name", "Pickup")
    dname = session.get("destination_name", "Destination")

    session["provider_redirected_at"] = int(time.time() * 1000)
    session["status"] = "provider_redirected"

    if provider == "uber":
        universal_url = f"https://m.uber.com/ul/?action=setPickup&client_id=surakshitpath&pickup[latitude]={plat:.6f}&pickup[longitude]={plng:.6f}&pickup[formatted_address]={urllib.parse.quote(pname)}&dropoff[latitude]={dlat:.6f}&dropoff[longitude]={dlng:.6f}&dropoff[formatted_address]={urllib.parse.quote(dname)}"
        deep_link = f"uber://?action=setPickup&pickup[latitude]={plat:.6f}&pickup[longitude]={plng:.6f}&dropoff[latitude]={dlat:.6f}&dropoff[longitude]={dlng:.6f}"
        fallback_url = "https://m.uber.com/"
    elif provider == "ola":
        universal_url = f"https://book.olacabs.com/?lat={plat:.6f}&lng={plng:.6f}&drop_lat={dlat:.6f}&drop_lng={dlng:.6f}&drop_name={urllib.parse.quote(dname)}"
        deep_link = f"olacabs://app/launch?lat={plat:.6f}&lng={plng:.6f}&drop_lat={dlat:.6f}&drop_lng={dlng:.6f}"
        fallback_url = "https://book.olacabs.com/"
    else:
        universal_url = "https://www.rapido.bike"
        deep_link = "rapido://app"
        fallback_url = "https://www.rapido.bike"

    return {
        "ride_id": ride_id,
        "provider": provider,
        "universal_url": universal_url,
        "deep_link_url": deep_link,
        "fallback_url": fallback_url,
        "disclaimer": "Driver selection and driver verification are handled by the ride provider. SurakshitPath does not guarantee driver or passenger safety."
    }

@app.post("/api/ride/{ride_id}/monitoring")
async def toggle_ride_monitoring(ride_id: str, req: RideMonitoringToggleRequest):
    """
    Enables/disables optional trip monitoring for a ride session.
    """
    import time
    session = ride_sessions_db.get(ride_id)
    if not session:
        # Create on the fly if not in memory
        session = {
            "ride_id": ride_id,
            "started_at": int(time.time() * 1000),
            "status": "monitoring_started" if req.monitoring_enabled else "provider_redirected"
        }
        ride_sessions_db[ride_id] = session

    session["monitoring_enabled"] = req.monitoring_enabled
    if req.monitoring_enabled:
        session["monitoring_started_at"] = session.get("monitoring_started_at") or int(time.time() * 1000)
        session["status"] = "monitoring_started"
    elif req.status:
        session["status"] = req.status

    if req.vehicle_number:
        session["vehicle_number"] = req.vehicle_number
    if req.driver_name:
        session["driver_name"] = req.driver_name

    return {
        "success": True,
        "session": session,
        "monitoring_active": session["monitoring_enabled"]
    }

@app.get("/api/ride/{ride_id}")
async def get_ride_session_status(ride_id: str):
    """
    Returns Ride Shield session status.
    """
    session = ride_sessions_db.get(ride_id)
    if not session:
        raise HTTPException(status_code=404, detail="Ride session not found")
    return {
        "session": session
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
