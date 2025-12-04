from django.contrib import admin
from django.http import JsonResponse
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from crm.views import (
    CompanyViewSet,
    ContactViewSet,
    DealViewSet,
    ActivityViewSet,
    SequenceViewSet,
    ContactBulkImportView,
    dashboard_summary,
    contacts_by_status,
    company_industry_stats,
)


def home(request):
    return JsonResponse({"message": "CRM API Running"})


router = DefaultRouter()
router.register(r"companies", CompanyViewSet)
router.register(r"contacts", ContactViewSet)
router.register(r"deals", DealViewSet)
router.register(r"activities", ActivityViewSet)
router.register(r"sequences", SequenceViewSet)

urlpatterns = [
    path("", home),
    path("admin/", admin.site.urls),

    # Main API router
    path("api/", include(router.urls)),

    # Bulk import
    path(
        "api/contacts/bulk_import/",
        ContactBulkImportView.as_view(),
        name="contacts-bulk-import",
    ),

    # Dashboard endpoints
    path(
        "api/dashboard/summary/",
        dashboard_summary,
        name="dashboard-summary",
    ),
    path(
        "api/dashboard/contacts_by_status/",
        contacts_by_status,
        name="contacts-by-status",
    ),
    path(
        "api/dashboard/company_industry_stats/",
        company_industry_stats,
        name="company-industry-stats",
    ),
]
