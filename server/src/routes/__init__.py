from fastapi import APIRouter
from src.routes.EventPricings import router as event_princing_router
from src.routes.Events import router as event_router
from src.routes.Orders import router as order_router
from src.routes.PayMethods import router as pay_method_router
from src.routes.Seats import router as seats_router
from src.routes.Tickets import router as ticket_router
from src.routes.Users import router as  user_router
from src.routes.Venues import router as venue_router
from src.routes.Zones import router as zone_router

router = APIRouter()
router.include_router(event_princing_router)
router.include_router(event_router)
router.include_router(order_router)
router.include_router(pay_method_router)
router.include_router(seats_router)
router.include_router(ticket_router)
router.include_router(user_router)
router.include_router(venue_router)
router.include_router(zone_router)