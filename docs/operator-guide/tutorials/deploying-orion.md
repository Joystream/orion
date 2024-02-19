# Deployment

When deploying Orion to production, you should host it under the same root domain as your Atlas instance. For example, if Atlas homepage of your Gateway is going t be served at `https://mygateway.com`, the Orion Auth API can be set up under `https://auth.mygateway.com` and the GraphQL API under `https://query.mygateway.com`. Alternatively, you can set up everything under the exact same domain, ie. the Auth API under `https://mygateway.com/api/v1`, the GraphQL api under `https://mygateway.com/graphql` and the Atlas app under `https://mygateway.com`. In this guide however, we'll focus on the first option, where Orion APIs are hosted under separate subdomains.

There are multiple reverse proxy servers that you can use to host Orion in production, like [Nginx](https://www.nginx.com/) or [Caddy](https://caddyserver.com/). In this guide we'll be focusing on Caddy because of its simplicity.

The following guide will allow you to deploy the **latest** version of Orion

## Prerequisites

On your server, you'll need to have [Docker](https://docs.docker.com/) and `docker-compose` installed (see: [installation instructions](https://docs.docker.com/engine/install/))

If you're on a Linux server you can use the [convinience script](https://docs.docker.com/engine/install/ubuntu/#install-using-the-convenience-script) to install docker engine and then install `docker-compose` with `sudo apt install docker-compose`.


You will also need to own a domain where you'll be hosting your Orion instance. In this guide we'll be using `mygateway.com` as an example domain. To be able to use subdomains like `auth.mygateway.com` and `query.mygateway.com` you need to make sure that your domain is either configured with a [wildcard DNS record](https://developers.cloudflare.com/dns/manage-dns-records/reference/wildcard-dns-records/) or that you have added a separate DNS record for each of the subdomains.

You will also need a sendgrid account with an api key in order to have email notifications being send.

## Step-by-step guide

### 1. Orion setup
1. Copy the `.env`, `docker-compose.yml`, `postgres.conf` and `Caddyfile` from the [`examples`](../examples/) directory to your server.
1. Configure the Orion production environment variables. Inside the `.env` file you will find comments describing the meaning of each of the variables. Most importantly make sure to:
    1. Replace all "placeholder" values inside angle brackets (`<>`) with the real values
    1. Fill in all the secrets (`OPERATOR_SECRET`, `APP_PRIVATE_KEY`, `COOKIE_SECRET`) with proper, randomly generated values
    1. **Make sure that `ORION_ENV` is set to `production`!**
    1. Set `GATEWAY_ROOT_DOMAIN` to your Gateway's root domain, in our example case it'll be `mygateway.com`
    1. (Optional) Configure the email notification scheduler chron job (for Orion >= `3.2.0`) in order to have notification delivery via email (see: [Email Notifications](./email-notifications.md))

### 2. Atlas static Deployment (optional)
This step is optional in case you are considering using a different deployment service like Vercel for example

1. Prepare a production build of the Atlas app. Assuming you have already cloned the Atlas repository and configured the environment variables inside `packages/atlas/src/.env` as described in the [Atlas operator guide](https://github.com/Joystream/atlas/blob/master/docs/operator-guide.md), you'll also need to:
    1. Make sure the `VITE_ENV` value is set to `production`
    1. Set `VITE_PRODUCTION_ORION_AUTH_URL` to your Orion Auth API endpoint (`https://auth.mygateway.com/api/v1` in our example case)
    1. Set `VITE_PRODUCTION_ORION_URL` to your Orion GraphQL API endpoint (`https://query.mygateway.com/graphql` in our example case)
    1. Set `VITE_PRODUCTION_QUERY_NODE_SUBSCRIPTION_URL` to your Orion GraphQL API WebSocket endpoint (`wss://query.mygateway.com/graphql` in our example case)
    1. (Optionally) You can also set `VITE_PRODUCTION_NODE_URL` to your own [Joystream node](https://github.com/Joystream/joystream/tree/master/bin/node) endpoint and `VITE_PRODUCTION_FAUCET_URL` to your own [Membership faucet](https://github.com/Joystream/membership-faucet), but we won't be describing how to set up any other services in this guide.
1. Once the Atlas environment is correctly configured for the production build, you can build the Atlas app by running:
    ```bash
    # Assuming you're in the root directory of the Atlas repository:
    yarn atlas:build
    ```
1. Copy the build artifacts from `packages/atlas/dist` to `atlas` directory inside the same location on your production server where you already copied the `docker-compose.yml` file. Your final directory structure should look like this:
    ```
    ├── .env
    ├── Caddyfile
    ├── atlas
    │   ├── android-chrome-192x192.png
    │   ├── android-chrome-512x512.png
    │   ├── apple-touch-icon.png
    │   ├── assets
    │   ├── embedded
    │   ├── favicon.ico
    │   ├── icon.svg
    │   ├── index.html
    │   ├── manifest.webmanifest
    │   ├── og-image-ypp.webp
    │   ├── og-image.webp
    │   ├── robots.txt
    │   └── stats.html
    ├── docker-compose.yml
    └── postgres.conf
    ```

That's it! Your gateway should now be available under `https://mygateway.com`!
If you kept the Auth API playground enabled in your `.env` (`OPENAPI_PLAYGROUND=true`), you can also use `https://auth.mygateway.com/playground` to perform the Operator authentication (as described in _[Local testing](./local-testing.md#authentication)_ tutorial) and then execute Operator queries and mutations through `https://query.mygateway.com/graphql`.

### 3. Orion deployment
Once everything is set up, you can start:
a.The Orion services only with:
    ```bash
    docker-compose up -d
    ```
b.The Orion services and the Caddy server by running:
    ```bash
    docker-compose --profile deploy up -d
    ```