"""
Mock Client Code
"""

from google.protobuf.timestamp_pb2 import Timestamp
from users_pb2 import PhoneCategory, UserCreateRequest
from users_pb2_grpc import AddUserStub
import time
import grpc

now = time.time()
now_seconds = int(now)
now_nanos = int((now - now_seconds) * 10**9)

now_timestamp = Timestamp(seconds=now_seconds, nanos=now_nanos)

channel = grpc.insecure_channel("localhost:8000")
# channel = grpc.insecure_channel("localhost:50051")
client = AddUserStub(channel)
request = UserCreateRequest(
  email_address = 'testing@mail.com',
  first_name = 'Tester',
  last_name = 'McTesterson',
  phone_category = PhoneCategory.MOBILE,
  phone = '111-222-3333',
  birthday = now_timestamp,
  age = 40,
  created_at = now_timestamp,
)
client.Add(request)