# User recommendations in Orion
User recommendations are outsourced to the external provider.
Initial implementation was done with the Recombee API, and it is out of the box solution offered. 

### Abstraction
All the logic for the provider was abstracted and ecapsulated in [`RecommendationServiceManager`](../../../src/utils/RecommendationServiceManager.ts) this means, that if you want to change 
the provider you just have to adjust the logic inside it and Orion will use the service to send data and get recommendations.

### Syncing data
- Video data gets upserted only through processor
- User data get upserted through `auth-server`
- Interactions data is proxied thorugh `interactions-server` where the request are limited both by IP and interactions.
Only iteraction that is not coming thorugh the server is rating interaction (like, dislike), which will be synced through processor on MemberRemark event.

### Env variables
Recombee client is constructed with 2 variables `RECOMMENDATION_SERVICE_PRIVATE_KEY` and `RECOMMENDATION_SERVICE_DATABASE` both self-explanatory.
`FORCE_RECOMMENDATION_DATA_SYNC` variable is a boolean that indicate whether processor should consider export block height in terms of syncing videos and ratings with recommendations service. 
If set to true - it will sync all the data for the first block even if last exported block is greater.

