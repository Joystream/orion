# DefaultApi

All URIs are relative to *http://localhost:4074/api/v1*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**anonymousAuth**](DefaultApi.md#anonymousAuth) | **POST** /anonymous-auth |  |
| [**confirmEmail**](DefaultApi.md#confirmEmail) | **POST** /confirm-email |  |
| [**login**](DefaultApi.md#login) | **POST** /login |  |
| [**logout**](DefaultApi.md#logout) | **POST** /logout |  |
| [**proveMembership**](DefaultApi.md#proveMembership) | **POST** /prove-membership |  |
| [**register**](DefaultApi.md#register) | **POST** /register |  |
| [**requestEmailConfirmationToken**](DefaultApi.md#requestEmailConfirmationToken) | **POST** /request-email-confirmation-token |  |
| [**requestPasswordResetToken**](DefaultApi.md#requestPasswordResetToken) | **POST** /request-password-reset-token |  |
| [**resetPassword**](DefaultApi.md#resetPassword) | **POST** /reset-password |  |


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

<a name="login"></a>
# **login**
> LoginResponseData login(LoginRequestData)



    Login to user&#39;s account, using e-mail and password.

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

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

<a name="proveMembership"></a>
# **proveMembership**
> GenericOkResponseData proveMembership(ProveMembershipRequestData)



    Prove ownership of an on-chain membership by an account.

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **ProveMembershipRequestData** | [**ProveMembershipRequestData**](../Models/ProveMembershipRequestData.md)|  | [optional] |

### Return type

[**GenericOkResponseData**](../Models/GenericOkResponseData.md)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

<a name="register"></a>
# **register**
> GenericOkResponseData register(RegisterRequestData)



    Create an account.

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **RegisterRequestData** | [**RegisterRequestData**](../Models/RegisterRequestData.md)|  | [optional] |

### Return type

[**GenericOkResponseData**](../Models/GenericOkResponseData.md)

### Authorization

No authorization required

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

<a name="requestPasswordResetToken"></a>
# **requestPasswordResetToken**
> GenericOkResponseData requestPasswordResetToken(RequestTokenRequestData)



    Request a token to be sent to account&#39;s e-mail address, which will allow resetting the account&#39;s password

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

<a name="resetPassword"></a>
# **resetPassword**
> GenericOkResponseData resetPassword(ResetPasswordRequestData)



    Reset account&#39;s password using a password reset token.

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **ResetPasswordRequestData** | [**ResetPasswordRequestData**](../Models/ResetPasswordRequestData.md)|  | [optional] |

### Return type

[**GenericOkResponseData**](../Models/GenericOkResponseData.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

