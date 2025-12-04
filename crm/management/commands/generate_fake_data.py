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

        self.stdout.write(self.style.WARNING("Generating fake companies…"))

        companies = []
        for _ in range(num_companies):
            c = Company(
                company_name=fake.company(),
                industry=fake.random_element([
                    "Software", "Finance", "Healthcare",
                    "Manufacturing", "Marketing", "Retail"
                ]),
                employee_count=random.randint(10, 5000),
                revenue=round(random.uniform(100000, 50000000), 2),
                city=fake.city(),
                country=fake.country(),
                created_at=fake.date_time(),
                updated_at=fake.date_time(),

                # Sheet-like fields
                location=fake.city(),
                company_type=fake.random_element(["Private", "Public", "Gov", "Startup"]),
                linkedin_company_url=f"https://www.linkedin.com/company/{fake.slug()}",
                search_url=f"https://www.google.com/search?q={fake.company()}",
                headquarter=fake.city(),
                company_address=fake.address(),
                establishment_date=str(fake.year()),
                company_summary=fake.text(max_nb_chars=200),
                company_website=f"https://{fake.domain_name()}",
                domain_name=fake.domain_name(),
                founded_year=random.randint(1980, 2023),
                funding=random.randint(100000, 10000000),
            )
            companies.append(c)

        Company.objects.bulk_create(companies, ignore_conflicts=True)
        self.stdout.write(self.style.SUCCESS("Companies created."))

        all_companies = list(Company.objects.all())

        self.stdout.write(self.style.WARNING("Generating fake contacts…"))

        contacts = []
        for _ in range(num_contacts):
            first = fake.first_name()
            last = fake.last_name()

            contacts.append(
                Contact(
                    company=random.choice(all_companies),
                    first_name=first,
                    last_name=last,
                    full_name=f"{first} {last}",
                    email=f"{first.lower()}.{last.lower()}@{fake.domain_name()}",
                    job_title=fake.job(),
                    created_at=fake.date_time(),
                    updated_at=fake.date_time(),

                    email_status=random.choice(["verified", "invalid", "catch-all", None]),
                    company_name=random.choice(all_companies).company_name,
                    seniority=random.choice(["Junior", "Mid", "Senior", "Director", None]),
                    sales_nav_url=f"https://www.linkedin.com/sales/search/{fake.slug()}",
                    status=random.choice(["New", "Working", "Contacted", "Nurture"]),
                    duration=random.choice(["1 year", "2 years", "6 months", None]),
                    connection_degree=random.choice(["1", "2", "3"]),
                    sr_no=random.randint(1, 100000),
                    location=fake.city(),
                    sales_nav_profile_url=f"https://linkedin.com/in/{fake.slug()}",
                    search_url=f"https://www.google.com/search?q={first}+{last}",
                    official_email=f"{first.lower()}.{last.lower()}@{fake.domain_name()}",
                )
            )

        Contact.objects.bulk_create(contacts, ignore_conflicts=True)
        self.stdout.write(self.style.SUCCESS("Contacts created."))

        self.stdout.write(self.style.SUCCESS("FAKE DATA GENERATION COMPLETE ✓"))
