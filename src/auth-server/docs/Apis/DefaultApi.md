# DefaultApi

All URIs are relative to *http://localhost/api/v1*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**anonymousAuth**](DefaultApi.md#anonymousAuth) | **POST** /anonymous-auth |  |
| [**changeAccount**](DefaultApi.md#changeAccount) | **POST** /change-account |  |
| [**confirmEmail**](DefaultApi.md#confirmEmail) | **POST** /confirm-email |  |
| [**createAccount**](DefaultApi.md#createAccount) | **POST** /account |  |
| [**getArtifacts**](DefaultApi.md#getArtifacts) | **GET** /artifacts |  |
| [**getSessionArtifacts**](DefaultApi.md#getSessionArtifacts) | **GET** /session-artifacts |  |
| [**login**](DefaultApi.md#login) | **POST** /login |  |
| [**logout**](DefaultApi.md#logout) | **POST** /logout |  |
| [**postSessionArtifacts**](DefaultApi.md#postSessionArtifacts) | **POST** /session-artifacts |  |
| [**registerUserInteraction**](DefaultApi.md#registerUserInteraction) | **POST** /register-user-interaction |  |
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

<a name="changeAccount"></a>
# **changeAccount**
> GenericOkResponseData changeAccount(ChangeAccountRequestData)



    Change the blockchain (Joystream) account associated with the Gateway account. Delete the old account&#39;s encryption artifacts and optionally set new ones.

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **ChangeAccountRequestData** | [**ChangeAccountRequestData**](../Models/ChangeAccountRequestData.md)|  | [optional] |

### Return type

[**GenericOkResponseData**](../Models/GenericOkResponseData.md)

### Authorization

[cookieAuth](../README.md#cookieAuth)

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



    Login to user&#39;s account by providing a message signed by the associated blockchain account.

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

<a name="registerUserInteraction"></a>
# **registerUserInteraction**
> GenericOkResponseData registerUserInteraction(RegisterUserInteractionRequestData)



    Register a user interaction with Atlas part.

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **RegisterUserInteractionRequestData** | [**RegisterUserInteractionRequestData**](../Models/RegisterUserInteractionRequestData.md)|  | [optional] |

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

