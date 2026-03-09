from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# ===== MODELS =====

class Service(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name: str
    category: str
    description: str
    duration: int  # in minutes
    price: float
    image_url: str

class ServiceCreate(BaseModel):
    name: str
    category: str
    description: str
    duration: int
    price: float
    image_url: str

class Staff(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name: str
    title: str
    bio: str
    specialties: List[str]
    image_url: str
    years_experience: int

class StaffCreate(BaseModel):
    name: str
    title: str
    bio: str
    specialties: List[str]
    image_url: str
    years_experience: int

class Booking(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    client_name: str
    client_email: str
    client_phone: str
    service_id: str
    staff_id: str
    date: str
    time: str
    notes: Optional[str] = ""
    created_at: str

class BookingCreate(BaseModel):
    client_name: str
    client_email: str
    client_phone: str
    service_id: str
    staff_id: str
    date: str
    time: str
    notes: Optional[str] = ""

class Review(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    client_name: str
    rating: int
    comment: str
    service_name: str
    created_at: str

class ReviewCreate(BaseModel):
    client_name: str
    rating: int
    comment: str
    service_name: str

class Promotion(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    title: str
    description: str
    discount: str
    valid_until: str
    image_url: str

class PromotionCreate(BaseModel):
    title: str
    description: str
    discount: str
    valid_until: str
    image_url: str

class Transformation(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    title: str
    before_image: str
    after_image: str
    description: str

# ===== ROUTES =====

@api_router.get("/")
async def root():
    return {"message": "Ethereal Glow Beauty Salon API"}

# Services endpoints
@api_router.get("/services", response_model=List[Service])
async def get_services():
    services = await db.services.find({}, {"_id": 0}).to_list(1000)
    return services

@api_router.post("/services", response_model=Service)
async def create_service(service: ServiceCreate):
    import uuid
    service_dict = service.model_dump()
    service_dict['id'] = str(uuid.uuid4())
    await db.services.insert_one(service_dict)
    return Service(**service_dict)

# Staff endpoints
@api_router.get("/staff", response_model=List[Staff])
async def get_staff():
    staff = await db.staff.find({}, {"_id": 0}).to_list(1000)
    return staff

@api_router.post("/staff", response_model=Staff)
async def create_staff(staff_member: StaffCreate):
    import uuid
    staff_dict = staff_member.model_dump()
    staff_dict['id'] = str(uuid.uuid4())
    await db.staff.insert_one(staff_dict)
    return Staff(**staff_dict)

# Bookings endpoints
@api_router.get("/bookings", response_model=List[Booking])
async def get_bookings():
    bookings = await db.bookings.find({}, {"_id": 0}).to_list(1000)
    return bookings

@api_router.post("/bookings", response_model=Booking)
async def create_booking(booking: BookingCreate):
    import uuid
    booking_dict = booking.model_dump()
    booking_dict['id'] = str(uuid.uuid4())
    booking_dict['created_at'] = datetime.now(timezone.utc).isoformat()
    await db.bookings.insert_one(booking_dict)
    return Booking(**booking_dict)

# Reviews endpoints
@api_router.get("/reviews", response_model=List[Review])
async def get_reviews():
    reviews = await db.reviews.find({}, {"_id": 0}).to_list(1000)
    return reviews

@api_router.post("/reviews", response_model=Review)
async def create_review(review: ReviewCreate):
    import uuid
    review_dict = review.model_dump()
    review_dict['id'] = str(uuid.uuid4())
    review_dict['created_at'] = datetime.now(timezone.utc).isoformat()
    await db.reviews.insert_one(review_dict)
    return Review(**review_dict)

# Promotions endpoints
@api_router.get("/promotions", response_model=List[Promotion])
async def get_promotions():
    promotions = await db.promotions.find({}, {"_id": 0}).to_list(1000)
    return promotions

@api_router.post("/promotions", response_model=Promotion)
async def create_promotion(promotion: PromotionCreate):
    import uuid
    promotion_dict = promotion.model_dump()
    promotion_dict['id'] = str(uuid.uuid4())
    await db.promotions.insert_one(promotion_dict)
    return Promotion(**promotion_dict)

# Transformations endpoint
@api_router.get("/transformations", response_model=List[Transformation])
async def get_transformations():
    transformations = await db.transformations.find({}, {"_id": 0}).to_list(1000)
    return transformations

# Seed data endpoint
@api_router.post("/seed")
async def seed_data():
    # Clear existing data
    await db.services.delete_many({})
    await db.staff.delete_many({})
    await db.reviews.delete_many({})
    await db.promotions.delete_many({})
    await db.transformations.delete_many({})
    
    # Seed services
    services = [
        {
            "id": "svc-1",
            "name": "Signature Haircut & Style",
            "category": "Hair",
            "description": "Precision cut tailored to your face shape and lifestyle, finished with expert styling.",
            "duration": 60,
            "price": 75.00,
            "image_url": "https://images.unsplash.com/photo-1599387737838-660b75526801?crop=entropy&cs=srgb&fm=jpg&q=85"
        },
        {
            "id": "svc-2",
            "name": "Balayage Color Treatment",
            "category": "Hair",
            "description": "Hand-painted highlights for a natural, sun-kissed look with dimensional color.",
            "duration": 180,
            "price": 225.00,
            "image_url": "https://images.unsplash.com/photo-1562322140-8baeececf3df?crop=entropy&cs=srgb&fm=jpg&q=85"
        },
        {
            "id": "svc-3",
            "name": "Luxury Spa Facial",
            "category": "Spa",
            "description": "Deep cleansing facial with customized treatment mask and rejuvenating massage.",
            "duration": 90,
            "price": 150.00,
            "image_url": "https://images.unsplash.com/photo-1722350766824-f8520e9676ac?crop=entropy&cs=srgb&fm=jpg&q=85"
        },
        {
            "id": "svc-4",
            "name": "Gel Manicure",
            "category": "Nails",
            "description": "Long-lasting gel polish application with nail shaping and cuticle care.",
            "duration": 45,
            "price": 55.00,
            "image_url": "https://images.unsplash.com/photo-1720086196723-a1e0656a90a5?crop=entropy&cs=srgb&fm=jpg&q=85"
        },
        {
            "id": "svc-5",
            "name": "Bridal Makeup",
            "category": "Makeup",
            "description": "Flawless, camera-ready makeup for your special day with trial session included.",
            "duration": 120,
            "price": 200.00,
            "image_url": "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?crop=entropy&cs=srgb&fm=jpg&q=85"
        },
        {
            "id": "svc-6",
            "name": "Keratin Treatment",
            "category": "Hair",
            "description": "Smooth, frizz-free hair for up to 3 months with our premium keratin formula.",
            "duration": 150,
            "price": 300.00,
            "image_url": "https://images.unsplash.com/photo-1560066984-138dadb4c035?crop=entropy&cs=srgb&fm=jpg&q=85"
        }
    ]
    await db.services.insert_many(services)
    
    # Seed staff
    staff = [
        {
            "id": "staff-1",
            "name": "Isabella Martinez",
            "title": "Master Stylist & Colorist",
            "bio": "With over 12 years of experience, Isabella specializes in color transformations and precision cuts.",
            "specialties": ["Balayage", "Color Correction", "Precision Cuts"],
            "image_url": "https://images.unsplash.com/photo-1560869631-a8eb0aa68932?crop=entropy&cs=srgb&fm=jpg&q=85",
            "years_experience": 12
        },
        {
            "id": "staff-2",
            "name": "James Chen",
            "title": "Senior Hair Stylist",
            "bio": "James brings modern techniques and classic style to every cut, specializing in men's grooming.",
            "specialties": ["Men's Cuts", "Beard Styling", "Texture Work"],
            "image_url": "https://images.unsplash.com/photo-1771594836586-837aa05be563?crop=entropy&cs=srgb&fm=jpg&q=85",
            "years_experience": 8
        },
        {
            "id": "staff-3",
            "name": "Sophia Laurent",
            "title": "Lead Esthetician",
            "bio": "Sophia is certified in advanced skincare treatments and creates customized facial experiences.",
            "specialties": ["Facials", "Microdermabrasion", "Chemical Peels"],
            "image_url": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?crop=entropy&cs=srgb&fm=jpg&q=85",
            "years_experience": 10
        },
        {
            "id": "staff-4",
            "name": "Emma Thompson",
            "title": "Nail Artist & Technician",
            "bio": "Emma creates stunning nail art and provides exceptional nail care with attention to detail.",
            "specialties": ["Nail Art", "Gel Extensions", "Spa Pedicures"],
            "image_url": "https://images.unsplash.com/photo-1580489944761-15a19d654956?crop=entropy&cs=srgb&fm=jpg&q=85",
            "years_experience": 6
        }
    ]
    await db.staff.insert_many(staff)
    
    # Seed reviews
    reviews = [
        {
            "id": "rev-1",
            "client_name": "Sarah Williams",
            "rating": 5,
            "comment": "Absolutely love my balayage! Isabella is a true artist. The salon atmosphere is so relaxing and luxurious.",
            "service_name": "Balayage Color Treatment",
            "created_at": "2024-12-15T10:30:00Z"
        },
        {
            "id": "rev-2",
            "client_name": "Michael Davis",
            "rating": 5,
            "comment": "Best haircut I've ever had! James understood exactly what I wanted and delivered perfectly.",
            "service_name": "Signature Haircut & Style",
            "created_at": "2024-12-18T14:20:00Z"
        },
        {
            "id": "rev-3",
            "client_name": "Emily Rodriguez",
            "rating": 5,
            "comment": "The luxury facial was incredible! My skin has never felt better. Sophia is amazing!",
            "service_name": "Luxury Spa Facial",
            "created_at": "2024-12-20T16:45:00Z"
        },
        {
            "id": "rev-4",
            "client_name": "Jessica Park",
            "rating": 5,
            "comment": "Emma's nail art is stunning! Such a talented artist. Will definitely be returning!",
            "service_name": "Gel Manicure",
            "created_at": "2024-12-22T11:00:00Z"
        }
    ]
    await db.reviews.insert_many(reviews)
    
    # Seed promotions
    promotions = [
        {
            "id": "promo-1",
            "title": "New Year Glow",
            "description": "Start 2025 with radiant skin! Get 20% off all spa facial treatments.",
            "discount": "20% OFF",
            "valid_until": "2025-01-31",
            "image_url": "https://images.unsplash.com/photo-1722350766824-f8520e9676ac?crop=entropy&cs=srgb&fm=jpg&q=85"
        },
        {
            "id": "promo-2",
            "title": "Color Refresh Special",
            "description": "Transform your look! Balayage and color treatments at special pricing.",
            "discount": "$50 OFF",
            "valid_until": "2025-02-14",
            "image_url": "https://images.unsplash.com/photo-1562322140-8baeececf3df?crop=entropy&cs=srgb&fm=jpg&q=85"
        },
        {
            "id": "promo-3",
            "title": "First Visit Gift",
            "description": "New clients receive 15% off any service. Welcome to Ethereal Glow!",
            "discount": "15% OFF",
            "valid_until": "2025-12-31",
            "image_url": "https://images.unsplash.com/photo-1599387737838-660b75526801?crop=entropy&cs=srgb&fm=jpg&q=85"
        }
    ]
    await db.promotions.insert_many(promotions)
    
    # Seed transformations
    transformations = [
        {
            "id": "trans-1",
            "title": "Blonde Transformation",
            "before_image": "https://images.unsplash.com/photo-1589220286904-3dcef62c68ee?crop=entropy&cs=srgb&fm=jpg&q=85",
            "after_image": "https://images.unsplash.com/photo-1672794776762-18dddc72982e?crop=entropy&cs=srgb&fm=jpg&q=85",
            "description": "From brunette to stunning blonde balayage"
        },
        {
            "id": "trans-2",
            "title": "Hair Color Magic",
            "before_image": "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?crop=entropy&cs=srgb&fm=jpg&q=85",
            "after_image": "https://images.unsplash.com/photo-1562322140-8baeececf3df?crop=entropy&cs=srgb&fm=jpg&q=85",
            "description": "Vibrant color transformation with dimensional highlights"
        }
    ]
    await db.transformations.insert_many(transformations)
    
    return {"message": "Database seeded successfully"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()