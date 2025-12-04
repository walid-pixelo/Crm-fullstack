import csv
import io

from django.db import transaction
from django.db.models import Count
from django.utils import timezone
from django.utils.timezone import now

from rest_framework import status, viewsets
from rest_framework.decorators import api_view
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.pagination import PageNumberPagination
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend

from .models import Company, Contact, Deal, Activity, Sequence
from .serializers import (
    CompanySerializer,
    ContactSerializer,
    DealSerializer,
    ActivitySerializer,
    SequenceSerializer,
)


# -----------------------------------
# Pagination
# -----------------------------------
class StandardResultsSetPagination(PageNumberPagination):
    page_size = 50
    page_size_query_param = "page_size"
    max_page_size = 200


# -----------------------------------
# Companies
# -----------------------------------
class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all().order_by("company_id")
    serializer_class = CompanySerializer
    pagination_class = StandardResultsSetPagination

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]

    # Only fields that REALLY exist in your companies table
    filterset_fields = [
        "industry",
        "company_type",
    ]

    search_fields = [
        "company_name",
        "company_url",
        "company_website",
        "domain_name",
    ]

    ordering_fields = [
        "employee_count",
        "created_at",
        "updated_at",
    ]


# -----------------------------------
# Contacts
# -----------------------------------
class ContactViewSet(viewsets.ModelViewSet):
    queryset = Contact.objects.all().order_by("contact_id")
    serializer_class = ContactSerializer
    pagination_class = StandardResultsSetPagination

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]

    # ONLY fields that exist in your current contacts table
    filterset_fields = [
        "status",
        "connection_degree",
        "duration",
        "company_name",
        "email_status",
        "location",  # <-- add
        "job_title",
    ]

    search_fields = [
        "first_name",
        "last_name",
        "full_name",
        "official_email",
        "email",
        "job_title",
        "company_name",
        "location",
        "sales_nav_profile_url",
        "sales_nav_url",
    ]

    ordering_fields = [
        "created_at",
        "updated_at",
        "sr_no",
        "first_name",
        "last_name",
        "status",
    ]


# -----------------------------------
# Deals
# -----------------------------------
class DealViewSet(viewsets.ModelViewSet):
    queryset = Deal.objects.all().order_by("-created_at")
    serializer_class = DealSerializer
    pagination_class = StandardResultsSetPagination

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ["deal_stage", "deal_owner", "company", "contact"]
    search_fields = ["deal_name"]
    ordering_fields = ["amount", "close_date", "created_at"]


# -----------------------------------
# Activities
# -----------------------------------
class ActivityViewSet(viewsets.ModelViewSet):
    queryset = Activity.objects.all().order_by("-activity_date")
    serializer_class = ActivitySerializer
    pagination_class = StandardResultsSetPagination

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ["activity_type", "activity_outcome", "contact"]
    ordering_fields = ["activity_date"]


# -----------------------------------
# Sequences
# -----------------------------------
class SequenceViewSet(viewsets.ModelViewSet):
    queryset = Sequence.objects.all().order_by("-created_at")
    serializer_class = SequenceSerializer
    pagination_class = StandardResultsSetPagination

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ["status"]
    search_fields = ["sequence_name"]
    ordering_fields = ["created_at", "updated_at"]


# -----------------------------------
# Helper
# -----------------------------------
def to_int(value):
    if value is None:
        return None
    v = str(value).strip()
    if not v:
        return None
    v = v.replace(",", "")
    try:
        return int(v)
    except ValueError:
        return None


# -----------------------------------
# Bulk Import API
# -----------------------------------
class ContactBulkImportView(APIView):
    """
    POST /api/contacts/bulk_import/
    Body: multipart/form-data with field "file" = CSV exported from Google Sheets
    """

    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, *args, **kwargs):
        csv_file = request.FILES.get("file")
        if not csv_file:
            return Response(
                {"detail": "Upload a file with form field name 'file'."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        decoded = csv_file.read().decode("utf-8-sig")
        reader = csv.DictReader(io.StringIO(decoded))

        created_contacts = 0
        created_companies = 0

        with transaction.atomic():
            for row in reader:
                # --- Company ---
                company_name = row.get("Company Name") or row.get("company_name") or ""
                company = None

                if company_name:
                    company, was_created = Company.objects.get_or_create(
                        company_name=company_name
                    )
                    if was_created:
                        created_companies += 1

                    company.industry = row.get("Industry") or company.industry
                    company.company_type = row.get("Company Type") or company.company_type
                    company.employee_count = (
                        to_int(row.get("Employee Count")) or company.employee_count
                    )
                    company.company_address = (
                        row.get("Company Address") or company.company_address
                    )
                    company.company_summary = (
                        row.get("Company Summary") or company.company_summary
                    )
                    company.company_website = (
                        row.get("Company Website") or company.company_website
                    )
                    company.domain_name = (
                        row.get("Domain Name") or company.domain_name
                    )
                    company.headquarter = row.get("Headquarter") or company.headquarter
                    company.linkedin_company_url = (
                        row.get("Company URL") or company.linkedin_company_url
                    )
                    company.search_url = (
                        row.get("Search URL") or company.search_url
                    )
                    company.save()

                # --- Contact ---
                contact = Contact(
                    company=company,
                    sr_no=to_int(row.get("Sr. No.") or row.get("Sr No")),
                    full_name=row.get("FullName") or row.get("Full Name") or None,
                    first_name=row.get("First Name") or "",
                    last_name=row.get("Last Name") or "",
                    job_title=row.get("Job Title") or "",
                    company_name=company_name or None,
                    location=row.get("Location") or "",
                    duration=row.get("Duration") or "",
                    connection_degree=row.get("Connection Degree") or "",
                    status=row.get("Status") or "",
                    official_email=row.get("Official Email") or "",
                    email=row.get("Official Email") or None,
                    sales_nav_profile_url=row.get("Sales Nav Profile URL") or "",
                    search_url=row.get("Search URL") or "",
                )
                contact.save()
                created_contacts += 1

        return Response(
            {
                "imported_contacts": created_contacts,
                "new_companies": created_companies,
            },
            status=status.HTTP_201_CREATED,
        )


# -----------------------------------
# Dashboard APIs
# -----------------------------------
@api_view(["GET"])
def dashboard_summary(request):
    """
    Total contacts, total companies, new contacts today.
    """
    today = timezone.localdate()

    total_contacts = Contact.objects.count()
    total_companies = Company.objects.count()
    new_contacts_today = Contact.objects.filter(created_at__date=today).count()

    return Response(
        {
            "total_contacts": total_contacts,
            "total_companies": total_companies,
            "new_contacts_today": new_contacts_today,
        }
    )


@api_view(["GET"])
def contacts_by_status(request):
    """
    [{ "status": "New", "total": 123 }, ...]
    """
    data = (
        Contact.objects.values("status")
        .annotate(total=Count("contact_id"))
        .order_by("-total")
    )

    for row in data:
        row["status"] = row["status"] or "Unknown"

    return Response(list(data))


@api_view(["GET"])
def company_industry_stats(request):
    """
    [{ "industry": "Software", "total": 42 }, ...]
    """
    data = (
        Company.objects.values("industry")
        .annotate(total=Count("company_id"))
        .order_by("-total")
    )

    for row in data:
        row["industry"] = row["industry"] or "Unknown"

    return Response(list(data))
