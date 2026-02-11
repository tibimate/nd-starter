from django.core.management.base import BaseCommand
from faker import Faker
import random
from clients.models import Client

class Command(BaseCommand):
    help = 'Generate fake clients for testing'
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--count',
            type=int,
            default=100,
            help='Number of fake clients to create'
        )

    def handle(self, *args, **kwargs):
        fake = Faker()
        count = kwargs['count']
        created = 0
        skipped = 0
        for i in range(count):
          try:
            Client.objects.create(
                name=fake.company(),
                email=fake.unique.company_email(),
                tin=fake.unique.bothify(text='??######'),
                phone_number=fake.phone_number(),
                address=fake.street_address(),
                active=random.choice([True, False])
            )
            created += 1
            if (i + 1) % 50 == 0:
              self.stdout.write(
                  self.style.SUCCESS(f'✓ Created {created} clients...')
              )

          except Exception as e:
            skipped += 1
            self.stdout.write(self.style.WARNING(f'Skipped creating client due to error: {e}'))
            continue
        
        self.stdout.write(
            self.style.SUCCESS(
                f'\n✅ Process completed: {created} clients created, {skipped} skipped'
            )
        )