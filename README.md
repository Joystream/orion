# Orion

Orion is a backend service for [Atlas](https://github.com/Joystream/atlas). It is a GraphQL API that combines [Query Node](https://github.com/Joystream/joystream/tree/master/query-node) data with some of its own data to provide a unified API for Atlas. Current Orion functionalities include:

- Proxying data from the Query Node
- Keeping count of video views and channel follows
- Providing featured content data
- Handling content reporting

## Functionalities overview

### Video views and channel follows

Orion keeps track of video views and channel follows happening in Atlas. It does so by following very simple approach - it offers 3 mutations - `addVideoView`, `followChannel` and `unfollowChannel`. Based on the operation, data in the database is updated. However, Orion currently doesn't use any authentication mechanism. That means that anyone can call these mutation any number of times. It is very easy to create thousands of fake views and follows. This is a temporary solution and will be replaced with a more robust solution in the future.

### Featured content

Orion provides a way to set featured content in Atlas. This currently includes video hero and featured videos for each video category. This is done by providing a set of mutations that allow to set the featured content. The mutations are:
- `setVideoHero`
- `setCategoryFeaturedVideos`

Both of those mutations require a secret token (`ORION_FEATURED_CONTENT_SECRET`) to be provided in the `Authorization` header.

To get more information about featured content, please refer to [this Atlas document](https://github.com/Joystream/atlas/blob/master/docs/community/featured-content.md).

### Content reporting

Orion also enables content reporting which may be useful to you as an operator. When the app users see something that shouldn't be there (e.g. illegal content or copyright infringement), they can report it using 2 mutations - `reportVideo` and `reportChannel`. Orion's operators can then review the reports and take appropriate actions. You can use this GraphQL query to get all the content reports:

```graphql
query {
  reportedVideos {
    id
    videoId
    reporterIp
    rationale
  }

  reportedChannels {
    id
    channelId
    reporterIp
    rationale
  }
}
```

Both of those queries require a secret token (`ORION_ADMIN_SECRET`) to be provided in the `Authorization` header.

## Deployment

Orion uses following environment variables:

- `ORION_MONGO_HOSTNAME` - **required**, hostname of the MongoDB instance to keep Orion's data
- `ORION_QUERY_NODE_URL` - **required**, URL of the Query Node GraphQL endpoint
- `ORION_FEATURED_CONTENT_SECRET` - **required**, secret token used to authorize featured content mutations
- `ORION_ADMIN_SECRET` - **required**, secret token used to authorize admin mutations
- `ORION_MONGO_PORT` - _optional_, port of the MongoDB instance, defaults to `27017`
- `ORION_MONGO_DATABASE` - _optional_, name of the MongoDB database, defaults to `orion`
- `ORION_PORT` - _optional_, port on which Orion will be available, defaults to `6116`
- `ORION_DEBUGGING` - _optional_, enables debugging, defaults to `false`

### Docker

Easiest way to deploy Orion is by using the provided Docker image. You can find the latest image on [Docker Hub](https://hub.docker.com/r/joystream/orion).

To start Orion and MongoDB, you can use `docker-compose`. Just remember to first update the environment variables in the `docker-compose.yml` file.

```shell
docker-compose up
```

## Starting a dev server

```shell script
yarn install
yarn run dev
```
