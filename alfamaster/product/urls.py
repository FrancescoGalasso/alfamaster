from django.conf.urls import url, include
from . import views


urlpatterns = [
    url(r'^$', views.product_list, name='product_list'),
    url(r'^product/(?P<pk>[0-9]+)/$', views.product_detail, name='product_detail'),
    url(r'^product/new/$', views.product_savenew, name='product_savenew'),
    url(r'^delete/(?P<pk>[0-9]+)/$', views.product_delete, name='product_delete'),
    url(r'^product/update/(?P<pk>[0-9]+)$', views.product_update, name='product_update'),
    url(r'^product/save/$', views.product_saveupdate, name='product_saveupdate'),
    url(r'^erase/(?P<pk>[0-9]+)/$', views.product_erase, name='product_erase'),
    url(r'^', include('accounts.urls')),
    # url(r'^product/csv/$', views.download_csv, name='download_csv'),
    url(r'^bases/$', views.retrieveBasesAndFillvl, name='retrieveBasesAndFillvl'),
    url(r'^master/$', views.retrieveMaster, name='retrieveMaster'),
]