# DefaultApi

All URIs are relative to *http://localhost:4074/api/v1*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**anonymousAuth**](DefaultApi.md#anonymousAuth) | **POST** /anonymous-auth |  |
| [**confirmEmail**](DefaultApi.md#confirmEmail) | **POST** /confirm-email |  |
| [**connectAccount**](DefaultApi.md#connectAccount) | **POST** /connect-account |  |
| [**createAccount**](DefaultApi.md#createAccount) | **POST** /account |  |
| [**deleteArtifacts**](DefaultApi.md#deleteArtifacts) | **DELETE** /artifacts |  |
| [**disconnectAccount**](DefaultApi.md#disconnectAccount) | **POST** /disconnect-account |  |
| [**getArtifacts**](DefaultApi.md#getArtifacts) | **GET** /artifacts |  |
| [**getSessionArtifacts**](DefaultApi.md#getSessionArtifacts) | **GET** /session-artifacts |  |
| [**login**](DefaultApi.md#login) | **POST** /login |  |
| [**logout**](DefaultApi.md#logout) | **POST** /logout |  |
| [**postArtifacts**](DefaultApi.md#postArtifacts) | **POST** /artifacts |  |
| [**postSessionArtifacts**](DefaultApi.md#postSessionArtifacts) | **POST** /session-artifacts |  |
| [**requestEmailConfirmationToken**](DefaultApi.md#requestEmailConfirmationToken) | **POST** /request-email-confirmation-token |  |


<a name="anonymousAuth"></a>
# **anonymousAuth**
> AnonymousUserAuthResponseData anonymousAuth(AnonymousUserAuthRequestData)



    Authenticate as an anonymous user, either using an existing user identifier or creating a new one.

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **AnonymousUserAuthRequestData** | [**AnonymousUserAuthRequestData**](../Models/AnonymousUserAuthRequestData.md)|  | [optional] |

### Return type

[**AnonymousUserAuthResponseData**](../Models/AnonymousUserAuthResponseData.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

<a name="confirmEmail"></a>
# **confirmEmail**
> GenericOkResponseData confirmEmail(ConfirmEmailRequestData)



    Confirm account&#39;s e-mail address provided during registration.

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **ConfirmEmailRequestData** | [**ConfirmEmailRequestData**](../Models/ConfirmEmailRequestData.md)|  | [optional] |

### Return type

[**GenericOkResponseData**](../Models/GenericOkResponseData.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

<a name="connectAccount"></a>
# **connectAccount**
> GenericOkResponseData connectAccount(ConnectAccountRequestData)



    Connect a Joystream account (key) with the Gateway acount by providing a signed proof of ownership.

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **ConnectAccountRequestData** | [**ConnectAccountRequestData**](../Models/ConnectAccountRequestData.md)|  | [optional] |

### Return type

[**GenericOkResponseData**](../Models/GenericOkResponseData.md)

### Authorization

[cookieAuth](../README.md#cookieAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

<a name="createAccount"></a>
# **createAccount**
> GenericOkResponseData createAccount(CreateAccountRequestData)



    Create a new Gateway account. Requires anonymousAuth to be performed first.

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **CreateAccountRequestData** | [**CreateAccountRequestData**](../Models/CreateAccountRequestData.md)|  | [optional] |

### Return type

[**GenericOkResponseData**](../Models/GenericOkResponseData.md)

### Authorization

[cookieAuth](../README.md#cookieAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

<a name="deleteArtifacts"></a>
# **deleteArtifacts**
> GenericOkResponseData deleteArtifacts()



    Delete wallet seed encryption artifacts in case they are no longer needed.

### Parameters
This endpoint does not need any parameter.

### Return type

[**GenericOkResponseData**](../Models/GenericOkResponseData.md)

### Authorization

[cookieAuth](../README.md#cookieAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

<a name="disconnectAccount"></a>
# **disconnectAccount**
> GenericOkResponseData disconnectAccount(DisconnectAccountRequestData)



    Disconnect a Joystream account (key) from the Gateway acount.

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **DisconnectAccountRequestData** | [**DisconnectAccountRequestData**](../Models/DisconnectAccountRequestData.md)|  | [optional] |

### Return type

[**GenericOkResponseData**](../Models/GenericOkResponseData.md)

### Authorization

[cookieAuth](../README.md#cookieAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

<a name="getArtifacts"></a>
# **getArtifacts**
> EncryptionArtifacts getArtifacts(id, email)



    Get wallet seed encryption artifacts.

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | **String**| The lookup key derived from user&#39;s credentials. | [default to null] |
| **email** | **String**| The user&#39;s email address. | [default to null] |

### Return type

[**EncryptionArtifacts**](../Models/EncryptionArtifacts.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

<a name="getSessionArtifacts"></a>
# **getSessionArtifacts**
> EncryptionArtifacts getSessionArtifacts()



    Get wallet seed encryption artifacts for the current session.

### Parameters
This endpoint does not need any parameter.

### Return type

[**EncryptionArtifacts**](../Models/EncryptionArtifacts.md)

### Authorization

[cookieAuth](../README.md#cookieAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

<a name="login"></a>
# **login**
> LoginResponseData login(LoginRequestData)



    Login to user&#39;s account by providing a message signed by one of the user&#39;s connected accounts.

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **LoginRequestData** | [**LoginRequestData**](../Models/LoginRequestData.md)|  | [optional] |

### Return type

[**LoginResponseData**](../Models/LoginResponseData.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

<a name="logout"></a>
# **logout**
> GenericOkResponseData logout()



    Terminate the current session.

### Parameters
This endpoint does not need any parameter.

### Return type

[**GenericOkResponseData**](../Models/GenericOkResponseData.md)

### Authorization

[cookieAuth](../README.md#cookieAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

<a name="postArtifacts"></a>
# **postArtifacts**
> GenericOkResponseData postArtifacts(EncryptionArtifacts)



    Save wallet seed encryption artifacts associated with the account (if not already saved).

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **EncryptionArtifacts** | [**EncryptionArtifacts**](../Models/EncryptionArtifacts.md)|  | [optional] |

### Return type

[**GenericOkResponseData**](../Models/GenericOkResponseData.md)

### Authorization

[cookieAuth](../README.md#cookieAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

<a name="postSessionArtifacts"></a>
# **postSessionArtifacts**
> GenericOkResponseData postSessionArtifacts(SessionEncryptionArtifacts)



    Save wallet seed encryption artifacts for the current session on the server.

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **SessionEncryptionArtifacts** | [**SessionEncryptionArtifacts**](../Models/SessionEncryptionArtifacts.md)|  | [optional] |

### Return type

[**GenericOkResponseData**](../Models/GenericOkResponseData.md)

### Authorization

[cookieAuth](../README.md#cookieAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

<a name="requestEmailConfirmationToken"></a>
# **requestEmailConfirmationToken**
> GenericOkResponseData requestEmailConfirmationToken(RequestTokenRequestData)



    Request a token to be sent to account&#39;s e-mail address, which will allow confirming the ownership of the e-mail by the user.

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **RequestTokenRequestData** | [**RequestTokenRequestData**](../Models/RequestTokenRequestData.md)|  | [optional] |

### Return type

[**GenericOkResponseData**](../Models/GenericOkResponseData.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

