# Generated by Django 4.2.1 on 2023-06-02 04:36

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('supermarket', '0004_remove_order_order_date_remove_orderitem_date_added'),
    ]

    operations = [
        migrations.RenameField(
            model_name='order',
            old_name='sent',
            new_name='cancelled',
        ),
        migrations.RemoveField(
            model_name='order',
            name='transaction_id',
        ),
    ]