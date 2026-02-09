from django.urls import path, include
from rest_framework.routers import DefaultRouter

from cards.views import TechniqueCardViewSet
from scenarios.views import ScenarioViewSet
from ai.views import GeneratePlanView

from accounts.auth_api import CsrfView, LoginView, LogoutView, RegisterView, MeView

router = DefaultRouter()
router.register(r"cards", TechniqueCardViewSet, basename="cards")
router.register(r"scenarios", ScenarioViewSet, basename="scenarios")

urlpatterns = [
    # AUTH for SPA
    path("auth/csrf/", CsrfView.as_view(), name="auth-csrf"),
    path("auth/login/", LoginView.as_view(), name="auth-login"),
    path("auth/logout/", LogoutView.as_view(), name="auth-logout"),
    path("auth/register/", RegisterView.as_view(), name="auth-register"),
    path("auth/me/", MeView.as_view(), name="auth-me"),

    # AI
    path("ai/generate-plan/", GeneratePlanView.as_view(), name="ai-generate-plan"),

    # API routers
    path("", include(router.urls)),
]
