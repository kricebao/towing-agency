from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import random
from fastapi import HTTPException

app = FastAPI()
# Enable CORS for frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Data Models
class Vehicle(BaseModel):
    id: str
    status: str
    providerName: str
    driverName: str
    lat: float
    lng: float
    rating: float

class VehicleUpdate(BaseModel):
    providerName: str
    status: str

# Initial Mock Data (Same as your constants.ts)
vehicles_db = [
    [
        {
            "id": "TOW-001",
            "status": "ACTIVE",
            "providerName": "QuickFix Towing",
            "driverName": "Mike",
            "lat": 40.7128,
            "lng": -74.006,
            "rating": 4.9
        },
        {
            "id": "TOW-002",
            "status": "BUSY",
            "providerName": "AAA Official Rescue",
            "driverName": "Sarah",
            "lat": 40.73,
            "lng": -74.05,
            "rating": 4.8
        },
        {
            "id": "TOW-003",
            "status": "ACTIVE",
            "providerName": "Zhang's Garage",
            "driverName": "Zhang",
            "lat": 40.8,
            "lng": -73.95,
            "rating": 4.5
        },
        {
            "id": "TOW-004",
            "status": "ACTIVE",
            "providerName": "Brooklyn Best Tow",
            "driverName": "Tony",
            "lat": 40.6782,
            "lng": -73.9442,
            "rating": 4.7
        },
        {
            "id": "TOW-005",
            "status": "OFFLINE",
            "providerName": "Queens Rapid Response",
            "driverName": "Peter",
            "lat": 40.7282,
            "lng": -73.7949,
            "rating": 4.2
        },
        {
            "id": "TOW-006",
            "status": "ACTIVE",
            "providerName": "Staten Island Rescue",
            "driverName": "Vinny",
            "lat": 40.5795,
            "lng": -74.1502,
            "rating": 4.6
        },
        {
            "id": "TOW-007",
            "status": "BUSY",
            "providerName": "Bronx Heavy Duty",
            "driverName": "Marcus",
            "lat": 40.8448,
            "lng": -73.8648,
            "rating": 4.4
        },
        {
            "id": "TOW-008",
            "status": "ACTIVE",
            "providerName": "Manhattan Elite",
            "driverName": "Jessica",
            "lat": 40.7831,
            "lng": -73.9712,
            "rating": 5.0
        },
        {
            "id": "TOW-009",
            "status": "OFFLINE",
            "providerName": "Jersey City Haul",
            "driverName": "Bill",
            "lat": 40.7178,
            "lng": -74.0431,
            "rating": 4.3
        },
        {
            "id": "TOW-010",
            "status": "ACTIVE",
            "providerName": "Newark Tow Masters",
            "driverName": "Jamal",
            "lat": 40.7357,
            "lng": -74.1724,
            "rating": 4.1
        },
        {
            "id": "TOW-011",
            "status": "BUSY",
            "providerName": "Hoboken Hook",
            "driverName": "Alex",
            "lat": 40.744,
            "lng": -74.0324,
            "rating": 4.8
        },
        {
            "id": "TOW-012",
            "status": "ACTIVE",
            "providerName": "Long Island Express",
            "driverName": "Ken",
            "lat": 40.74,
            "lng": -73.6,
            "rating": 4.6
        },
        {
            "id": "TOW-013",
            "status": "ACTIVE",
            "providerName": "Yonkers Yellow Truck",
            "driverName": "Luis",
            "lat": 40.9312,
            "lng": -73.8987,
            "rating": 4.5
        },
        {
            "id": "TOW-014",
            "status": "OFFLINE",
            "providerName": "Greenwich Village Tow",
            "driverName": "Emily",
            "lat": 40.7336,
            "lng": -74.0027,
            "rating": 4.9
        },
        {
            "id": "TOW-015",
            "status": "ACTIVE",
            "providerName": "Harlem Night Shift",
            "driverName": "Tyrone",
            "lat": 40.8116,
            "lng": -73.9465,
            "rating": 4.7
        },
        {
            "id": "TOW-016",
            "status": "BUSY",
            "providerName": "Astoria Auto Aid",
            "driverName": "Dimitri",
            "lat": 40.7644,
            "lng": -73.9235,
            "rating": 4.4
        },
        {
            "id": "TOW-017",
            "status": "ACTIVE",
            "providerName": "Flushing Flatbed",
            "driverName": "Wei",
            "lat": 40.7674,
            "lng": -73.8331,
            "rating": 4.3
        },
        {
            "id": "TOW-018",
            "status": "ACTIVE",
            "providerName": "Red Hook Recovery",
            "driverName": "Sam",
            "lat": 40.6734,
            "lng": -74.0083,
            "rating": 4.8
        },
        {
            "id": "TOW-019",
            "status": "OFFLINE",
            "providerName": "Williamsburg Wheels",
            "driverName": "Hip",
            "lat": 40.7126,
            "lng": -73.96,
            "rating": 4.2
        },
        {
            "id": "TOW-020",
            "status": "BUSY",
            "providerName": "Midtown Mechanics",
            "driverName": "Rock",
            "lat": 40.7549,
            "lng": -73.984,
            "rating": 4.9
        }
    ]

    # ... add rest of your vehicles here
]


@app.get("/api/vehicles", response_model=List[Vehicle])
async def get_vehicles():
    return vehicles_db


@app.post("/api/vehicles/simulate", response_model=List[Vehicle])
async def simulate_update():
    # Simulate movement and status changes
    for v in vehicles_db:
        # Random movement
        v["lat"] += (random.random() - 0.5) * 0.01
        v["lng"] += (random.random() - 0.5) * 0.01

        # Random status change (10% chance)
        if random.random() > 0.9:
            v["status"] = random.choice(["Active", "Busy", "Offline"])

    return vehicles_db


@app.post("/api/vehicles/update")
async def update_vehicle_status(update_data: VehicleUpdate):
    # 遍历数据库查找匹配的 providerName
    for vehicle in vehicles_db:
        # 兼容之前的数据库结构（扁平列表）
        if vehicle["providerName"] == update_data.providerName:
            vehicle["status"] = update_data.status
            return vehicle

    # 如果没找到
    raise HTTPException(status_code=404, detail="Provider not found")
