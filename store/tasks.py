from celery import shared_task
# import time


@shared_task
def my_task(arg1, arg2):
    # Task logic here
    result = arg1 + arg2
    # time.sleep(2)
    return result
