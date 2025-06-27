# 🧠 User Management API - Django + DRF + DRF Spectacular

Este proyecto es un backend REST API para la **gestión de usuarios, roles y permisos**, utilizando el modelo de usuario por defecto de Django. Incluye documentación automática con **DRF Spectacular** (Swagger & Redoc).

---

## ⚙️ Tecnologías

- Django
- Django REST Framework
- DRF Spectacular (OpenAPI 3)
- SQLite (por defecto)

---

## 🚀 Instalación paso a paso

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu_usuario/user-management-api.git
cd user-management-api
````

### 2. Crear entorno virtual

```bash
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
```

### 3. Instalar dependencias

```bash
pip install -r requirements.txt
```

Si no tienes un `requirements.txt`, puedes crear uno con:

```bash
pip install django djangorestframework drf-spectacular
pip freeze > requirements.txt
```

### 4. Crear el proyecto y las apps (si aún no están creadas)

```bash
django-admin startproject user_management .
python manage.py startapp users
python manage.py startapp docs
```

---

## ⚙️ Configuración en `settings.py`

Agregar en `INSTALLED_APPS`:

```python
INSTALLED_APPS = [
    ...
    'rest_framework',
    'drf_spectacular',
    'users',
    'docs',
]
```

Agregar la configuración de DRF y Spectacular:

```python
REST_FRAMEWORK = {
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.BasicAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
}

SPECTACULAR_SETTINGS = {
    'TITLE': 'User Management API',
    'DESCRIPTION': 'API para gestionar usuarios, roles y permisos con el modelo por defecto de Django.',
    'VERSION': '1.0.0',
    'SERVE_INCLUDE_SCHEMA': False,
}
```

---

## 🧩 URLs

### `docs/urls.py`

```python
from django.urls import path
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)

urlpatterns = [
    path("schema/", SpectacularAPIView.as_view(), name="schema"),
    path("swagger/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
    path("redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"),
]
```

### `user_management/urls.py`

```python
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('users.urls')),
    path('docs/', include('docs.urls')),
]
```

---

## 🔐 Crear superusuario

```bash
python manage.py migrate
python manage.py createsuperuser
```

Sigue las instrucciones para establecer usuario, correo y contraseña.

---

## 🧪 Ejecutar servidor local

```bash
python manage.py runserver
```

---

## 📄 Endpoints de Documentación

* Swagger UI: [`/docs/swagger/`](http://localhost:8000/docs/swagger/)
* Redoc: [`/docs/redoc/`](http://localhost:8000/docs/redoc/)
* OpenAPI Schema: [`/docs/schema/`](http://localhost:8000/docs/schema/)

---

## ✉️ Endpoints de API

Una vez autenticado con el superusuario, puedes acceder a:

* `GET /api/users/` - Lista de usuarios
* `GET /api/groups/` - Lista de grupos/roles

---

## ✅ Todo incluido

* ✅ Gestión de usuarios (modelo por defecto de Django)
* ✅ Gestión de grupos (roles) y permisos
* ✅ Autenticación básica
* ✅ Documentación OpenAPI 3.0 (Swagger + Redoc)

---

## 🛡️ Recomendaciones para producción

* Usar autenticación con JWT (ej: `djangorestframework-simplejwt`)
* Configurar HTTPS
* Configurar CORS y CSRF
* Base de datos PostgreSQL

---
