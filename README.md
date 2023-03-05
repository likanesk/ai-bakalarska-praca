<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="60" alt="Nest Logo" /></a>
</p>

## Description

**Bakalarska praca - Adrian Ihring**

## Installation

```bash
$ npm install
```

## Running the app

use the docker-compse.yml file to install:

- database postgresql
- microservice "ecb-exchange-rates-rest-api" and pick up dev or prod variant

## Swagger Web REST API interface for development

[DEV REST API web interface](http://localhost:3000/api)

## License

Nest is [MIT licensed](LICENSE).

## CLI commands

get access token example:

```bash
$ curl -X POST http://localhost:3000/api/v1/ecb-exhange-rates/auth/login -d '{"username": "adrian.ihring@gmail.com", "password": "a+J}pF$+2}u+Y3hn"}' -H "Content-Type: application/json"
```

get user JWT payload info from access token:

```bash
$ curl http://localhost:3000/api/v1/ecb-exhange-rates/user/profile -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkcmlhbi5paHJpbmdAZ21haWwuY29tIiwic3ViIjoiZDEyM2ZlYTMtYjYxMC00N2NmLWEyZDAtZjYyOGY4ZWY4MWY3IiwiaWF0IjoxNjc2NzM5MTQ5LCJleHAiOjE2NzY3MzkyMDl9.HaHvf3XkEcxAyDJ5P9yuNNm0olWUVM14QMAneP-BeU0"
```
