# Generated by Django 4.2.1 on 2023-05-29 22:07

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='address',
            old_name='address1',
            new_name='street1',
        ),
        migrations.RenameField(
            model_name='address',
            old_name='address2',
            new_name='street2',
        ),
    ]