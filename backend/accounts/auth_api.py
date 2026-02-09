from __future__ import annotations

from django.contrib.auth import authenticate, get_user_model, login, logout
from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator

from rest_framework import status, permissions, serializers
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.models import UserRole


User = get_user_model()



class LoginSerializer(serializers.Serializer):
    login = serializers.CharField()
    password = serializers.CharField()


class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(min_length=6)


class MeSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    username = serializers.CharField()
    email = serializers.EmailField(allow_blank=True, allow_null=True)
    role = serializers.CharField()



@method_decorator(ensure_csrf_cookie, name="dispatch")
class CsrfView(APIView):
    """
    GET /api/auth/csrf/
    Выставляет csrftoken cookie.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        token = get_token(request)
        return Response({"csrfToken": token}, status=status.HTTP_200_OK)


class LoginView(APIView):
    """
    POST /api/auth/login/
    Body: { "login": "<username-or-email>", "password": "<password>" }
    Response 200: { "ok": true }
    Errors:
      400 invalid payload
      401 invalid credentials
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        ser = LoginSerializer(data=request.data)
        ser.is_valid(raise_exception=True)

        login_value = ser.validated_data["login"].strip()
        password = ser.validated_data["password"]

        user = authenticate(request, username=login_value, password=password)

        if user is None:
            try:
                u = User.objects.filter(email__iexact=login_value).first()
            except Exception:
                u = None
            if u:
                user = authenticate(request, username=u.username, password=password)

        if user is None:
            return Response({"detail": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)

        if not user.is_active:
            return Response({"detail": "User is inactive."}, status=status.HTTP_403_FORBIDDEN)

        login(request, user)
        return Response({"ok": True}, status=status.HTTP_200_OK)


class LogoutView(APIView):
    """
    POST /api/auth/logout/
    Response 200: { "ok": true }
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        logout(request)
        return Response({"ok": True}, status=status.HTTP_200_OK)


class RegisterView(APIView):
    """
    POST /api/auth/register/
    Body: { "username": "...", "email": "...", "password": "..." }
    Response 201: { "ok": true }
    Errors:
      400 validation / username taken / email taken
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        ser = RegisterSerializer(data=request.data)
        ser.is_valid(raise_exception=True)

        username = ser.validated_data["username"].strip()
        email = ser.validated_data["email"].strip().lower()
        password = ser.validated_data["password"]

        if User.objects.filter(username__iexact=username).exists():
            return Response({"username": ["Username is already taken."]}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email__iexact=email).exists():
            return Response({"email": ["Email is already taken."]}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=username, email=email, password=password)

        return Response({"ok": True}, status=status.HTTP_201_CREATED)


class MeView(APIView):
    """
    GET /api/auth/me/
    Response 200:
      { id, username, email, role }
    Errors:
      401 not authenticated
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        role = getattr(getattr(user, "profile", None), "role", UserRole.USER)
        data = {"id": user.id, "username": user.username, "email": user.email, "role": role}
        return Response(MeSerializer(data).data, status=status.HTTP_200_OK)
