# Documentation for Orion authentication API

<a name="documentation-for-api-endpoints"></a>
## Documentation for API Endpoints

All URIs are relative to *http://localhost/api/v1*

| Class | Method | HTTP request | Description |
|------------ | ------------- | ------------- | -------------|
| *DefaultApi* | [**channelClicked**](Apis/DefaultApi.md#channelclicked) | **POST** /channel-clicked | Dispatches channel click event to the recommendation service. |
*DefaultApi* | [**rateVideo**](Apis/DefaultApi.md#ratevideo) | **POST** /rate-video | Dispatches video rate event to the recommendation service. |
*DefaultApi* | [**videoClicked**](Apis/DefaultApi.md#videoclicked) | **POST** /video-clicked | Dispatches video click event to the recommendation service. |
*DefaultApi* | [**videoConsumed**](Apis/DefaultApi.md#videoconsumed) | **POST** /video-consumed | Dispatches video consumed event to the recommendation service. |
*DefaultApi* | [**videoPortion**](Apis/DefaultApi.md#videoportion) | **POST** /video-portion | Dispatches video portion event to the recommendation service. |


<a name="documentation-for-models"></a>
## Documentation for Models

 - [GenericErrorResponseData](./Models/GenericErrorResponseData.md)
 - [GenericOkResponseData](./Models/GenericOkResponseData.md)
 - [ItemClickInteractionRequestData](./Models/ItemClickInteractionRequestData.md)
 - [ItemConsumedInteractionRequestData](./Models/ItemConsumedInteractionRequestData.md)
 - [ItemPortionInteractionRequestData](./Models/ItemPortionInteractionRequestData.md)
 - [ItemRateInteractionRequestData](./Models/ItemRateInteractionRequestData.md)


<a name="documentation-for-authorization"></a>
## Documentation for Authorization

<a name="bearerAuth"></a>
### bearerAuth

- **Type**: HTTP basic authentication

<a name="cookieAuth"></a>
### cookieAuth

- **Type**: API key
- **API key parameter name**: session_id
- **Location**: 

