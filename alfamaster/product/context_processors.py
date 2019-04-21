from django.conf import settings
import product

def alfamaster_settings(request):

    return {
        'PROJECT_VERSION': product.__version__,
        'PROJECT_BUILD': product.__build__,
    }
