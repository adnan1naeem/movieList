## Project setup

```bash
$ git clone https://github.com/adnan1naeem/movieList.git
$ yarn install
$ create .env file and add required environment variables, see env.example 
```

## Compile and run the project

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev
```

## API documentation
### Authentication Routes
#### Signup a new user

URL: ```baseurl/auth/signup```

Method: POST
Request Body:
```
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

#### Sign in an existing user
URL: ```baseurl/auth/signin```

Method: POST
```
Request Body:
{
  "email": "string",
  "password": "string"
}
```
Description: Authenticates an existing user and returns a JWT token.

### Movie Routes
#### Create a new movie

URL: ```baseurl/movies```
Method: POST

Headers:

Authorization: Bearer <JWT_TOKEN>

Request FormData:
```
{
  "title": "string",
  "year": "number",
  "image: file
}
```

#### Update an existing movie

URL: ```baseurl/movies/:id```

Method: PATCH

Headers:

Authorization: Bearer <JWT_TOKEN>

Request Params:

id: The ID of the movie to update.

Request Body:
```
{
  "title": "string",
  "year": "number",
  "image: file
}
```

#### Get all movies

URL: ```baseurl/movies```

Method: GET

Headers:

Authorization: Bearer <JWT_TOKEN>

Query Parameters:

skip (optional): The number of records to skip (default is 0).

take (optional): The number of records to return (default is 10).

