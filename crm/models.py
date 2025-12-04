from django.db import models
from django.contrib.postgres.search import SearchVectorField


# =========================
# COMPANY
# =========================
class Company(models.Model):
    company_id = models.BigAutoField(primary_key=True)

    # From DB
    company_name = models.TextField()                          # not null
    industry = models.TextField(null=True, blank=True)
    employee_count = models.IntegerField(null=True, blank=True)
    revenue = models.DecimalField(max_digits=18, decimal_places=2,
                                  null=True, blank=True)

    city = models.TextField(null=True, blank=True)
    country = models.TextField(null=True, blank=True)

    created_at = models.DateTimeField()   # DB default: now()
    updated_at = models.DateTimeField()   # DB default: now()

    founded_year = models.IntegerField(null=True, blank=True)
    funding = models.BigIntegerField(null=True, blank=True)

    # From sheet-style extras (already in DB)
    location = models.TextField(null=True, blank=True)
    company_type = models.TextField(null=True, blank=True)
    linkedin_company_url = models.TextField(null=True, blank=True)
    search_url = models.TextField(null=True, blank=True)
    headquarter = models.TextField(null=True, blank=True)
    company_address = models.TextField(null=True, blank=True)
    establishment_date = models.TextField(null=True, blank=True)
    company_summary = models.TextField(null=True, blank=True)
    company_website = models.TextField(null=True, blank=True)
    domain_name = models.TextField(null=True, blank=True)

    class Meta:
        db_table = "companies"
        managed = False   # table already exists, Django must NOT touch it

    def __str__(self):
        return self.company_name or f"Company {self.company_id}"


# =========================
# CONTACT
# =========================
class Contact(models.Model):
    contact_id = models.BigAutoField(primary_key=True)

    company = models.ForeignKey(
        Company,
        on_delete=models.SET_NULL,
        null=True,
        db_column="company_id",
        related_name="contacts",
    )

    # From DB
    first_name = models.TextField()
    last_name = models.TextField()
    email = models.TextField(null=True, blank=True, unique=True)
    job_title = models.TextField(null=True, blank=True)

    created_at = models.DateTimeField()   # DB default: now()
    updated_at = models.DateTimeField()

    email_status = models.TextField(null=True, blank=True)
    company_name = models.TextField(null=True, blank=True)

    # tsvector field in Postgres
    search_document = SearchVectorField(null=True, blank=True)

    seniority = models.TextField(null=True, blank=True)
    sales_nav_url = models.TextField(null=True, blank=True)
    status = models.TextField(null=True, blank=True)
    duration = models.TextField(null=True, blank=True)
    connection_degree = models.TextField(null=True, blank=True)
    full_name = models.TextField(null=True, blank=True)
    sr_no = models.IntegerField(null=True, blank=True)
    location = models.TextField(null=True, blank=True)
    sales_nav_profile_url = models.TextField(null=True, blank=True)
    search_url = models.TextField(null=True, blank=True)
    official_email = models.TextField(null=True, blank=True)

    class Meta:
        db_table = "contacts"
        managed = False

    def __str__(self):
        return self.full_name or f"{self.first_name} {self.last_name}"


# =========================
# DEAL
# =========================
class Deal(models.Model):
    deal_id = models.BigAutoField(primary_key=True)

    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        db_column="company_id",
        related_name="deals",
    )
    contact = models.ForeignKey(
        Contact,
        on_delete=models.SET_NULL,
        null=True,
        db_column="contact_id",
        related_name="deals",
    )

    deal_name = models.TextField()
    deal_stage = models.TextField()
    amount = models.DecimalField(max_digits=18, decimal_places=2,
                                 null=True, blank=True)
    close_date = models.DateField(null=True, blank=True)
    deal_owner = models.TextField(null=True, blank=True)

    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()

    class Meta:
        db_table = "deals"
        managed = False

    def __str__(self):
        return self.deal_name


# =========================
# ACTIVITY
# =========================
class Activity(models.Model):
    activity_id = models.BigAutoField(primary_key=True)

    contact = models.ForeignKey(
        Contact,
        on_delete=models.CASCADE,
        db_column="contact_id",
        related_name="activities",
    )

    activity_type = models.TextField()
    activity_date = models.DateTimeField()
    activity_outcome = models.TextField(null=True, blank=True)
    notes = models.TextField(null=True, blank=True)

    class Meta:
        db_table = "activities"
        managed = False

    def __str__(self):
        return f"{self.activity_type} on {self.activity_date}"


# =========================
# SEQUENCE
# =========================
class Sequence(models.Model):
    sequence_id = models.BigAutoField(primary_key=True)

    sequence_name = models.TextField()
    sequence_steps = models.JSONField()
    status = models.TextField()
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()

    class Meta:
        db_table = "sequences"
        managed = False

    def __str__(self):
        return self.sequence_name
