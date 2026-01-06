from django.core.management.base import BaseCommand
from faker import Faker
import random

from crm.models import Company, Contact


class Command(BaseCommand):
    help = "Generate fake CRM data (companies + contacts)"

    def add_arguments(self, parser):
        parser.add_argument(
            "--companies",
            type=int,
            default=1000,
            help="Number of companies to generate",
        )
        parser.add_argument(
            "--contacts",
            type=int,
            default=10000,
            help="Number of contacts to generate",
        )

    def handle(self, *args, **options):
        fake = Faker()
        Faker.seed(42)

        num_companies = options["companies"]
        num_contacts = options["contacts"]

        # -------------------------------------------------
        # 1) CREATE COMPANIES
        # -------------------------------------------------
        self.stdout.write(self.style.WARNING("Generating companies..."))

        industries = [
            "Software", "Finance", "Healthcare", "Manufacturing",
            "Marketing", "Retail", "E-commerce", "Education",
            "Telecommunications", "Logistics",
        ]
        company_types = ["Private", "Public", "Gov", "Startup"]

        company_objs = []
        for _ in range(num_companies):
            name = fake.company()
            city = fake.city()
            company_objs.append(
                Company(
                    company_name=name,
                    industry=random.choice(industries),
                    employee_count=random.randint(10, 5000),
                    revenue=round(random.uniform(100_000, 50_000_000), 2),
                    city=city,
                    country=fake.country(),
                    created_at=fake.date_time(),
                    updated_at=fake.date_time(),
                    # extended fields
                    location=city,
                    company_type=random.choice(company_types),
                    linkedin_company_url=f"https://www.linkedin.com/company/{fake.slug()}",
                    headquarter=city,
                    company_address=fake.address(),
                    company_summary=fake.text(max_nb_chars=200),
                    company_website=f"https://{fake.domain_name()}",
                    domain_name=fake.domain_name(),
                )
            )

        Company.objects.bulk_create(company_objs, ignore_conflicts=True)
        self.stdout.write(self.style.SUCCESS(f"{len(company_objs)} companies created."))

        # Reload from DB, using pk so we don't care what the PK field is called
        company_rows = list(
            Company.objects.values(
                "pk",
                "company_name",
                "domain_name",
            )
        )
        if not company_rows:
            self.stdout.write(self.style.ERROR("No companies found after bulk_create. Aborting."))
            return

        # -------------------------------------------------
        # 2) CREATE CONTACTS
        # -------------------------------------------------
        self.stdout.write(self.style.WARNING("Generating contacts..."))

        contacts = []

        status_choices = ["New", "Working", "Contacted", "Nurture"]
        email_status_choices = ["verified", "invalid", "catch-all", None]
        seniority_choices = ["Junior", "Mid", "Senior", "Director", None]
        duration_choices = ["6 months", "1 year", "2 years", "3 years", None]

        for _ in range(num_contacts):
            first = fake.first_name()
            last = fake.last_name()
            full_name = f"{first} {last}"

            company = random.choice(company_rows)
            company_pk = company["pk"]
            company_name = company["company_name"]
            domain = company["domain_name"] or fake.domain_name()

            # primary email
            email = f"{first.lower()}.{last.lower()}@{domain}"

            # sr_no = phone-like integer (10–11 digits, numeric only)
            phone_number_int = fake.random_int(min=6000000000, max=9999999999)

            slug = fake.slug()

            contacts.append(
                Contact(
                    # use FK id directly
                    company_id=company_pk,

                    # names
                    first_name=first,
                    last_name=last,
                    full_name=full_name,

                    # job & company
                    job_title=fake.job(),
                    company_name=company_name,

                    # CRM fields
                    status=random.choice(status_choices),
                    location=fake.city(),
                    seniority=random.choice(seniority_choices),
                    duration=random.choice(duration_choices),

                    # emails
                    official_email=email,
                    email=email,
                    email_status=random.choice(email_status_choices),

                    # Number column in UI -> sr_no in DB
                    sr_no=phone_number_int,

                    # LinkedIn URL column -> sales_nav_profile_url
                    sales_nav_profile_url=f"https://www.linkedin.com/in/{slug}",

                    # optional sales navigator search URL
                    sales_nav_url=f"https://www.linkedin.com/sales/search/{slug}",

                    created_at=fake.date_time(),
                    updated_at=fake.date_time(),
                )
            )

        Contact.objects.bulk_create(contacts, ignore_conflicts=True)
        self.stdout.write(self.style.SUCCESS(f"{len(contacts)} contacts created."))
        self.stdout.write(self.style.SUCCESS("FAKE DATA GENERATION COMPLETE ✓"))
