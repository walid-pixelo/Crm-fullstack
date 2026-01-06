# from django.db import models
# from django.contrib.postgres.search import SearchVectorField
from djongo import models


# =========================
# COMPANY
# =========================
# class Company(models.Model):
#     company_id = models.BigAutoField(primary_key=True)
#
#     # From DB
#     company_name = models.TextField()                          # not null
#     industry = models.TextField(null=True, blank=True)
#     employee_count = models.IntegerField(null=True, blank=True)
#     revenue = models.DecimalField(max_digits=18, decimal_places=2,
#                                   null=True, blank=True)
#
#     city = models.TextField(null=True, blank=True)
#     country = models.TextField(null=True, blank=True)
#
#     created_at = models.DateTimeField()   # DB default: now()
#     updated_at = models.DateTimeField()   # DB default: now()
#

#     funding = models.BigIntegerField(null=True, blank=True)
#
#     # From sheet-style extras (already in DB)
#     location = models.TextField(null=True, blank=True)
#     company_type = models.TextField(null=True, blank=True)
#     linkedin_company_url = models.TextField(null=True, blank=True)
#     search_url = models.TextField(null=True, blank=True)
#     headquarter = models.TextField(null=True, blank=True)
#     company_address = models.TextField(null=True, blank=True)
#     establishment_date = models.TextField(null=True, blank=True)
#     company_summary = models.TextField(null=True, blank=True)
#     company_website = models.TextField(null=True, blank=True)
#     domain_name = models.TextField(null=True, blank=True)
#
#     class Meta:
#         db_table = "companies"
#         managed = False   # table already exists, Django must NOT touch it
#
#     def __str__(self):
#         return self.company_name or f"Company {self.company_id}"


# class Company(models.Model):
#     company_id = models.AutoField(primary_key=True)
#     company_name = models.CharField(max_length=255)
#     industry = models.CharField(max_length=255, blank=True, null=True)
#     company_type = models.CharField(max_length=255, blank=True, null=True)
#     employee_count = models.IntegerField(blank=True, null=True)
#     company_address = models.TextField(blank=True, null=True)
#     company_summary = models.TextField(blank=True, null=True)
#     company_website = models.URLField(blank=True, null=True)
#     domain_name = models.CharField(max_length=255, blank=True, null=True)
#     headquarter = models.CharField(max_length=255, blank=True, null=True)
#     linkedin_company_url = models.URLField(blank=True, null=True)
#     search_url = models.URLField(blank=True, null=True)
#     revenue = models.DecimalField(
#         max_digits=12,
#         decimal_places=2,
#         null=True,
#         blank=True,
#     )
#
#     def __str__(self):
#         return self.company_name



# =========================
# CONTACT
# =========================
# class Contact(models.Model):
#     contact_id = models.BigAutoField(primary_key=True)
#
#     company = models.ForeignKey(
#         Company,
#         on_delete=models.SET_NULL,
#         null=True,
#         db_column="company_id",
#         related_name="contacts",
#     )
#
#     # From DB
#     first_name = models.TextField()
#     last_name = models.TextField()
#     email = models.TextField(null=True, blank=True, unique=True)
#     job_title = models.TextField(null=True, blank=True)
#
#     created_at = models.DateTimeField()   # DB default: now()
#     updated_at = models.DateTimeField()
#
#     email_status = models.TextField(null=True, blank=True)
#     company_name = models.TextField(null=True, blank=True)
#
#     # tsvector field in Postgres
#     search_document = SearchVectorField(null=True, blank=True)
#
#     seniority = models.TextField(null=True, blank=True)
#     sales_nav_url = models.TextField(null=True, blank=True)
#     status = models.TextField(null=True, blank=True)
#     duration = models.TextField(null=True, blank=True)
#     connection_degree = models.TextField(null=True, blank=True)
#     full_name = models.TextField(null=True, blank=True)
#     sr_no = models.IntegerField(null=True, blank=True)
#     location = models.TextField(null=True, blank=True)
#     sales_nav_profile_url = models.TextField(null=True, blank=True)
#     search_url = models.TextField(null=True, blank=True)
#     official_email = models.TextField(null=True, blank=True)
#
#     class Meta:
#         db_table = "contacts"
#         managed = False
#
#     def __str__(self):
#         return self.full_name or f"{self.first_name} {self.last_name}"

# class Contact(models.Model):
#     contact_id = models.AutoField(primary_key=True)
#     full_name = models.CharField(max_length=255, blank=True, null=True)
#     first_name = models.CharField(max_length=100)
#     last_name = models.CharField(max_length=100)
#     job_title = models.CharField(max_length=255)
#     company_name = models.CharField(max_length=255)
#     location = models.CharField(max_length=255, blank=True, null=True)
#     connection_degree = models.CharField(max_length=50, blank=True, null=True)
#     duration = models.CharField(max_length=50, blank=True, null=True)
#     status = models.CharField(max_length=50, blank=True, null=True)
#     official_email = models.EmailField(blank=True, null=True)
#     email = models.EmailField(blank=True, null=True)
#     sales_nav_profile_url = models.URLField(blank=True, null=True)
#
#     def __str__(self):
#         return self.full_name
#
#
# # =========================
# # DEAL
# # =========================
# class Deal(models.Model):
#     deal_id = models.BigAutoField(primary_key=True)
#
#     company = models.ForeignKey(
#         Company,
#         on_delete=models.CASCADE,
#         db_column="company_id",
#         related_name="deals",
#     )
#     contact = models.ForeignKey(
#         Contact,
#         on_delete=models.SET_NULL,
#         null=True,
#         db_column="contact_id",
#         related_name="deals",
#     )
#
#     deal_name = models.TextField()
#     deal_stage = models.TextField()
#     amount = models.DecimalField(max_digits=18, decimal_places=2,
#                                  null=True, blank=True)
#     close_date = models.DateField(null=True, blank=True)
#     deal_owner = models.TextField(null=True, blank=True)
#
#     created_at = models.DateTimeField()
#     updated_at = models.DateTimeField()
#
#     class Meta:
#         db_table = "deals"
#         managed = False
#
#     def __str__(self):
#         return self.deal_name
#
#
# # =========================
# # ACTIVITY
# # =========================
# class Activity(models.Model):
#     activity_id = models.BigAutoField(primary_key=True)
#
#     contact = models.ForeignKey(
#         Contact,
#         on_delete=models.CASCADE,
#         db_column="contact_id",
#         related_name="activities",
#     )
#
#     activity_type = models.TextField()
#     activity_date = models.DateTimeField()
#     activity_outcome = models.TextField(null=True, blank=True)
#     notes = models.TextField(null=True, blank=True)
#
#     class Meta:
#         db_table = "activities"
#         managed = False
#
#     def __str__(self):
#         return f"{self.activity_type} on {self.activity_date}"
#
#
# # =========================
# # SEQUENCE
# # =========================
# class Sequence(models.Model):
#     sequence_id = models.BigAutoField(primary_key=True)
#
#     sequence_name = models.TextField()
#     sequence_steps = models.JSONField()
#     status = models.TextField()
#     created_at = models.DateTimeField()
#     updated_at = models.DateTimeField()
#
#     class Meta:
#         db_table = "sequences"
#         managed = False
#
#     def __str__(self):
#         return self.sequence_name

from djongo import models


# =========================================
# COMPANY MODEL
# =========================================
class Company(models.Model):
    company_id = models.BigAutoField(primary_key=True)

    # From your sheet
    company_name = models.TextField()                          # Company Name
    industry = models.TextField(null=True, blank=True)         # Industry
    headquarter = models.TextField(null=True, blank=True)      # Headquarter
    company_type = models.TextField(null=True, blank=True)     # Company Type
    employee_count = models.IntegerField(null=True, blank=True)  # Employee Count
    company_address = models.TextField(null=True, blank=True)  # Company Address
    # establishment_date = models.DateField(null=True, blank=True)  # Establishment Date
    company_summary = models.TextField(null=True, blank=True)  # Company Summary
    location = models.CharField(max_length=255, blank=True, null=True)
    linkedin_company_url = models.URLField(blank=True, null=True)

    company_url = models.TextField(null=True, blank=True)      # Company URL
    company_website = models.TextField(null=True, blank=True)  # Company Website
    website = models.TextField(null=True, blank=True)          # legacy field
    domain_name = models.TextField(null=True, blank=True)      # Domain Name

    status = models.TextField(null=True, blank=True)           # Status

    city = models.TextField(null=True, blank=True)
    country = models.TextField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    revenue = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True,
    )

    class Meta:
        db_table = "companies"

    def __str__(self):
        return self.company_name or f"Company {self.company_id}"


# =========================================
# CONTACT MODEL
# =========================================
class Contact(models.Model):
    contact_id = models.BigAutoField(primary_key=True)

    company = models.ForeignKey(
        Company,
        on_delete=models.SET_NULL,
        null=True,
        db_column="company_id",
        related_name="contacts",
    )

    email_status = models.CharField(
        max_length=50,
        blank=True,
        null=True,
    )

    # From your sheet
    sr_no = models.IntegerField(null=True, blank=True)              # Sr. No.
    full_name = models.TextField(null=True, blank=True)             # FullName
    first_name = models.TextField(null=True, blank=True)            # First Name
    last_name = models.TextField(null=True, blank=True)             # Last Name
    job_title = models.TextField(null=True, blank=True)             # Job Title
    location = models.TextField(null=True, blank=True)              # Location
    duration = models.TextField(null=True, blank=True)              # Duration
    linkedin_url = models.TextField(null=True, blank=True)          # Linkedin URL
    sales_nav_profile_url = models.TextField(null=True, blank=True) # Sales Nav Profile URL
    search_url = models.TextField(null=True, blank=True)            # Search URL

    official_email = models.TextField(null=True, blank=True)        # Official Email
    email = models.TextField(null=True, blank=True)                 # legacy field
    status = models.TextField(null=True, blank=True)                # lead status etc.

    # Extra helper fields
    company_name = models.TextField(null=True, blank=True)
    city = models.TextField(null=True, blank=True)
    country = models.TextField(null=True, blank=True)

    # Extra fields used in fake_data
    seniority = models.TextField(null=True, blank=True)             # Seniority
    sales_nav_url = models.TextField(null=True, blank=True)         # Sales Nav search URL

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "contacts"

    def __str__(self):
        return (
            self.full_name
            or f"{self.first_name} {self.last_name}".strip()
            or f"Contact {self.contact_id}"
        )


# =========================================
# DEAL MODEL
# =========================================
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
    amount = models.DecimalField(max_digits=18, decimal_places=2, null=True, blank=True)
    close_date = models.DateField(null=True, blank=True)
    deal_owner = models.TextField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "deals"

    def __str__(self):
        return self.deal_name


# =========================================
# ACTIVITY MODEL
# =========================================
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

    def __str__(self):
        return f"{self.activity_type} on {self.activity_date}"


# =========================================
# SEQUENCE MODEL
# =========================================
class Sequence(models.Model):
    sequence_id = models.BigAutoField(primary_key=True)
    sequence_name = models.TextField()
    sequence_steps = models.JSONField()  # from djongo.models
    status = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "sequences"

    def __str__(self):
        return self.sequence_name
