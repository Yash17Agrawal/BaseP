from django.core.paginator import Paginator
from django.db.models import Q

'''
    filter_kwargs is used for putting condition which will be evaluated with OR
    filter_kwargs_and is used for conditions which will be evaluated with AND
'''


def common_pagination(model, page_size, page_no, serializer, filter_kwargs={}, filter_kwargs_and={}):
    # https://stackoverflow.com/a/58213764
    data = model.objects.filter(
        Q(**filter_kwargs, _connector=Q.OR), **filter_kwargs_and).order_by("created_at")
    # https://www.geeksforgeeks.org/how-to-add-pagination-in-django-project/
    # https://simpleisbetterthancomplex.com/tutorial/2016/08/03/how-to-paginate-with-django.html
    paginator = Paginator(data, page_size)
    try:
        result = paginator.page(int(page_no))
    except Exception:
        # result = paginator.page(paginator.num_pages)
        result = []
    response = dict()
    response["data"] = serializer(
        result, many=True).data
    response["totalRecords"] = len(data)
    response["pageSize"] = page_size
    response["page"] = page_no
    return response
