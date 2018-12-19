# file_master_online
Django site for the interactive usage of file_excell_master provided by laboratory

# Shell Django

```
>>> from product.models import Product
>>> Product.objects.all()
[<Product: lavabile>]
>>> Product.objects.get(pk='lavabile')
<Product: lavabile>

```

# Custom Commands

Before run `python manage.py runserver` it is advisable to execute the command

```
python manage.py create_folder_logs
```

If the custom command is not executed, running the application will raise an exception if the logs folder is not found