from django.contrib import sitemaps
from django.urls import reverse


class StaticViewSitemap(sitemaps.Sitemap):
    priority = 0.5
    changefreq = 'monthly'

    def items(self):
        return ['', 'pricing', 'contact', 'signin']

    def location(self, item):
        return "/{}/".format(item) if len(item) != 0 else "/"
        # return reverse(item)
