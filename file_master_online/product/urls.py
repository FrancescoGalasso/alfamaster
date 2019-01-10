from django.conf.urls import url, include
from . import views


urlpatterns = [
    url(r'^$', views.product_list, name='product_list'),
    url(r'^product/(?P<pk>[0-9]+)/$', views.product_detail, name='product_detail'),
    url(r'^product/new/$', views.product_new, name='product_new'),
    url(r'^delete/(?P<pk>[0-9]+)/$', views.product_delete, name='product_delete'),
    url(r'^product/update/(?P<pk>[0-9]+)$', views.product_update, name='product_update'),
    url(r'^product/save/$', views.product_save, name='product_save'),
    url(r'^', include('accounts.urls')),
    # url(r'^product/csv/$', views.download_csv, name='download_csv'),

]