"""
Server Code for the AddUser Microservice.
"""
from concurrent import futures
import grpc

from users_pb2 import UserSummary
import users_pb2_grpc

class AddUserService(users_pb2_grpc.AddUserServicer):
  def Add(self, request, context):
    full_name = f"{request.first_name} {request.last_name}"
    user = UserSummary(
      email_address = request.email_address,
      name = full_name,
    )
    print(f"Request: {request}")

    if request.age < 18:
      # context.abort(grpc.StatusCode.INVALID_ARGUMENT, "Invalid age to access.")
      user.success = False
      return user

    user.success = True
    return user

def serve():
  print("Server Started")
  server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
  users_pb2_grpc.add_AddUserServicer_to_server(
    AddUserService(), server
  )
  server.add_insecure_port("[::]:50051")
  server.start()
  server.wait_for_termination()

if __name__ == "__main__":
  serve()