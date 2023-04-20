# Documentation for Orion authentication API

<a name="documentation-for-api-endpoints"></a>
## Documentation for API Endpoints

All URIs are relative to *http://localhost:4074/api/v1*

| Class | Method | HTTP request | Description |
|------------ | ------------- | ------------- | -------------|
| *DefaultApi* | [**anonymousAuth**](Apis/DefaultApi.md#anonymousauth) | **POST** /anonymous-auth | Authenticate as an anonymous user, either using an existing user identifier or creating a new one. |
*DefaultApi* | [**confirmEmail**](Apis/DefaultApi.md#confirmemail) | **POST** /confirm-email | Confirm account's e-mail address provided during registration. |
*DefaultApi* | [**connectAccount**](Apis/DefaultApi.md#connectaccount) | **POST** /connect-account | Connect a Joystream account (key) with the Gateway acount by providing a signed proof of ownership. |
*DefaultApi* | [**disconnectAccount**](Apis/DefaultApi.md#disconnectaccount) | **POST** /disconnect-account | Disconnect a Joystream account (key) from the Gateway acount by providing a signed proof of ownership. |
*DefaultApi* | [**login**](Apis/DefaultApi.md#login) | **POST** /login | Login to user's account, using e-mail and password. |
*DefaultApi* | [**logout**](Apis/DefaultApi.md#logout) | **POST** /logout | Terminate the current session. |
*DefaultApi* | [**register**](Apis/DefaultApi.md#register) | **POST** /register | Create an account. Requires anonymousAuth to be performed first. |
*DefaultApi* | [**requestEmailConfirmationToken**](Apis/DefaultApi.md#requestemailconfirmationtoken) | **POST** /request-email-confirmation-token | Request a token to be sent to account's e-mail address, which will allow confirming the ownership of the e-mail by the user. |
*DefaultApi* | [**requestPasswordResetToken**](Apis/DefaultApi.md#requestpasswordresettoken) | **POST** /request-password-reset-token | Request a token to be sent to account's e-mail address, which will allow resetting the account's password |
*DefaultApi* | [**resetPassword**](Apis/DefaultApi.md#resetpassword) | **POST** /reset-password | Reset account's password using a password reset token. |


<a name="documentation-for-models"></a>
## Documentation for Models

 - [AnonymousUserAuthRequestData](./Models/AnonymousUserAuthRequestData.md)
 - [AnonymousUserAuthResponseData](./Models/AnonymousUserAuthResponseData.md)
 - [AnonymousUserAuthResponseData_allOf](./Models/AnonymousUserAuthResponseData_allOf.md)
 - [ConfirmEmailRequestData](./Models/ConfirmEmailRequestData.md)
 - [ConnectOrDisconnectAccountRequestData](./Models/ConnectOrDisconnectAccountRequestData.md)
 - [ConnectOrDisconnectAccountRequestData_payload](./Models/ConnectOrDisconnectAccountRequestData_payload.md)
 - [GenericErrorResponseData](./Models/GenericErrorResponseData.md)
 - [GenericOkResponseData](./Models/GenericOkResponseData.md)
 - [LoginRequestData](./Models/LoginRequestData.md)
 - [LoginResponseData](./Models/LoginResponseData.md)
 - [LoginResponseData_allOf](./Models/LoginResponseData_allOf.md)
 - [RegisterRequestData](./Models/RegisterRequestData.md)
 - [RequestTokenRequestData](./Models/RequestTokenRequestData.md)
 - [ResetPasswordRequestData](./Models/ResetPasswordRequestData.md)


<a name="documentation-for-authorization"></a>
## Documentation for Authorization

<a name="bearerAuth"></a>
### bearerAuth

- **Type**: HTTP basic authentication

