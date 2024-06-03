# DefaultApi

All URIs are relative to *http://localhost/api/v1*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**channelClicked**](DefaultApi.md#channelClicked) | **POST** /channel-clicked |  |
| [**rateVideo**](DefaultApi.md#rateVideo) | **POST** /rate-video |  |
| [**videoClicked**](DefaultApi.md#videoClicked) | **POST** /video-clicked |  |
| [**videoConsumed**](DefaultApi.md#videoConsumed) | **POST** /video-consumed |  |
| [**videoPortion**](DefaultApi.md#videoPortion) | **POST** /video-portion |  |


<a name="channelClicked"></a>
# **channelClicked**
> GenericOkResponseData channelClicked(ItemClickInteractionRequestData)



    Dispatches channel click event to the recommendation service.

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **ItemClickInteractionRequestData** | [**ItemClickInteractionRequestData**](../Models/ItemClickInteractionRequestData.md)|  | [optional] |

### Return type

[**GenericOkResponseData**](../Models/GenericOkResponseData.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

<a name="rateVideo"></a>
# **rateVideo**
> GenericOkResponseData rateVideo(ItemRateInteractionRequestData)



    Dispatches video rate event to the recommendation service.

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **ItemRateInteractionRequestData** | [**ItemRateInteractionRequestData**](../Models/ItemRateInteractionRequestData.md)|  | [optional] |

### Return type

[**GenericOkResponseData**](../Models/GenericOkResponseData.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

<a name="videoClicked"></a>
# **videoClicked**
> GenericOkResponseData videoClicked(ItemClickInteractionRequestData)



    Dispatches video click event to the recommendation service.

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **ItemClickInteractionRequestData** | [**ItemClickInteractionRequestData**](../Models/ItemClickInteractionRequestData.md)|  | [optional] |

### Return type

[**GenericOkResponseData**](../Models/GenericOkResponseData.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

<a name="videoConsumed"></a>
# **videoConsumed**
> GenericOkResponseData videoConsumed(ItemConsumedInteractionRequestData)



    Dispatches video consumed event to the recommendation service.

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **ItemConsumedInteractionRequestData** | [**ItemConsumedInteractionRequestData**](../Models/ItemConsumedInteractionRequestData.md)|  | [optional] |

### Return type

[**GenericOkResponseData**](../Models/GenericOkResponseData.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

<a name="videoPortion"></a>
# **videoPortion**
> GenericOkResponseData videoPortion(ItemPortionInteractionRequestData)



    Dispatches video portion event to the recommendation service.

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **ItemPortionInteractionRequestData** | [**ItemPortionInteractionRequestData**](../Models/ItemPortionInteractionRequestData.md)|  | [optional] |

### Return type

[**GenericOkResponseData**](../Models/GenericOkResponseData.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

