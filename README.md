Technologies used:
Python, gRPC, RabbitMQ (maybe)

PyDoc for gRPC:
https://grpc.io/docs/languages/python/basics/

Types in proto3:
https://developers.google.com/protocol-buffers/docs/proto3

Similar Tutorial: https://realpython.com/python-microservices-grpc/#example-implementation

Setup:
Install "vscode-proto3" extension for formatting

Create virtual environment

Run `pip3 install -r requirements.txt` with the requirements.txt folder from this tutorial in your directory

Steps:
1) Create protobufs folder and server folder
2) Create users.proto in protobufs folder and define your message structures and service.
3) cd into server directory
4) python -m grpc_tools.protoc -I ../protobufs --python_out=. \
         --grpc_python_out=. ../protobufs/users.proto

5) Let's test how we can interact with these newly generated files using a Python shell (which you can open by entering `python3`). We will use this to help us implement the logic of building a client.
`
from google.protobuf.timestamp_pb2 import Timestamp
from users_pb2 import PhoneCategory, UserCreateRequest
import time

now = time.time()
now_seconds = int(now)
now_nanos = int((now - now_seconds) * 10**9)

now_timestamp = Timestamp(seconds=now_seconds, nanos=now_nanos)

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
request.email_address
request.phone_category
request.created_at.ToJsonString()
`

Two notes on this - if you don't pass anything for a field it will default to 0 for ints and "" for strings. If you mismatch a type, you'll simply get an error. Feel free to test this out.

6) This code would be an example of a client given the current rpc we've defined. However, there is no actual microservice running on port 50051. We will define that rpc server in the next steps. For now, the below code will just throw you an exception in the terminal.
`
from google.protobuf.timestamp_pb2 import Timestamp
from users_pb2 import PhoneCategory, UserCreateRequest
from users_pb2_grpc import AddUserStub
import time
import grpc

now = time.time()
now_seconds = int(now)
now_nanos = int((now - now_seconds) * 10**9)

now_timestamp = Timestamp(seconds=now_seconds, nanos=now_nanos)

channel = grpc.insecure_channel("localhost:50051")
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
`

7) Let's start coding out our server. Put this code in your server folder in a file called `users.py`:

`
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
`

8) This rpc server will make a unary request. This and other types of requests are outlined here:
https://grpclib.readthedocs.io/en/latest/overview.html

You can now test the client code from earlier. Run the server file then execute the client code in another terminal window's python shell (and make sure your working directory is in the server folder so the imports work).

9) Let's startup our React app. Use create-react-app and call the app "client". The command to run this is `npx create-react-app client`

10) Let's grab the protos from our protobufs folder. Make a folder inside the app's src folder called "users".

11) Downloading and making grpc-web work:

From the README here https://github.com/grpc/grpc-web , continue to the next step.

First download grpc-web
https://github.com/grpc/grpc-web/releases

Download first option on newest release (darwin-x86 option)

Do the following to make it executable and add it to your path (mac users only probably):

`sudo mv ~/Downloads/protoc-gen-grpc-web-1.2.1-darwin-x86_64 \
    /usr/local/bin/protoc-gen-grpc-web`

`chmod +x /usr/local/bin/protoc-gen-grpc-web`

Then run this to generate code from your client's src/users folder.

protoc -I=[absolute path to protobufs folder]/ users.proto     --js_out=import_style=commonjs:.     --grpc-web_out=import_style=commonjs,mode=grpcwebtext:.

12) After confirming your two new js files were generated from the proto into your src folder, run
`npm install grpc-web`
and
`npm install google-protobuf`

13) Go ahead and write some basic code to communicate with your server in the React App.js.

/---
INSERT SIMPLE REACT CODE HERE WITHOUT VALIDATION AND SHIT
---\

14) Our React App will want to send HTTP/1 requests, but gRPC expects HTTP/2. Let's use a popular proxy, Envoy, to handle turning our requests into HTTP/2. Let's use Docker to get this proxy running. We pulled the example for the envoy.yaml file directly from the grpc-web repo. Put this in a folder titled "proxy".

/---
INSERT CODE HERE
---\

15) INSERT LINK EXPLAINING ALL THE DIFFERENT YAML OPTIONS

16) For now, we will connect to the unsecured port that our server is running on. We will revisit this later. Also add a Dockerfile to this directory.

/---
INSERT CODE HERE
---\

17) Build the docker image with this command:
`docker build -t grpc-envoy:1.0 .`

18) Lets get this spun up into a container called "grpc-envoy" by running:
`docker run --network=host --name grpc-envoy grpc-envoy:1.0`

THIS IS WHERE YOU LEFT OFF - YOURE TRYING TO RUN THE DOCKER IMAGE BUT YOU ARE GETTING AN ERROR "Unable to parse JSON as proto (INVALID_ARGUMENT:". This probably has to do with the envoy.yaml. Good luck homie.

19) Now let's see if our connection will work.

20) If your connection works and everything is behaving as expected, let's spruce up this React code with some validation.


`docker run -d -p 9901:9901 -p 8000:8000 --network=host --name grpc-envoy grpc-envoy:1.0`

curl https://localhost:8000/AddUser/Add

grpcurl -d '{"email_address": "testing@mail.com",
  first_name: "Tester",
  last_name: "McTesterson",}' \
    localhost:8000/AddUser/Add


NOTE: DOCUMENT SETUP STEPS FOR THE DEVTOOLS!! ALSO NOTE THAT YOULL NEED TO OPEN A NEW CHROME WINDOW FOR THEM TO WORK.
https://github.com/SafetyCulture/grpc-web-devtools

NOTE: DOCUMENT USING GRPCURL:
https://github.com/fullstorydev/grpcurl

Note on the docs that addresses mac listener port issue for envoy.yaml: https://github.com/grpc/grpc-web/tree/master/net/grpc/gateway/examples/helloworld#grpc-web-hello-world-guide

# grpc-example
