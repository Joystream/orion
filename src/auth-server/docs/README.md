# Documentation for Orion authentication API

<a name="documentation-for-api-endpoints"></a>
## Documentation for API Endpoints

All URIs are relative to *http://localhost/api/v1*

| Class | Method | HTTP request | Description |
|------------ | ------------- | ------------- | -------------|
| *DefaultApi* | [**anonymousAuth**](Apis/DefaultApi.md#anonymousauth) | **POST** /anonymous-auth | Authenticate as an anonymous user, either using an existing user identifier or creating a new one. |
*DefaultApi* | [**changeAccount**](Apis/DefaultApi.md#changeaccount) | **POST** /change-account | Change the blockchain (Joystream) account associated with the Gateway account. Delete the old account's encryption artifacts and optionally set new ones. |
*DefaultApi* | [**confirmEmail**](Apis/DefaultApi.md#confirmemail) | **POST** /confirm-email | Confirm account's e-mail address provided during registration. |
*DefaultApi* | [**createAccount**](Apis/DefaultApi.md#createaccount) | **POST** /account | Create a new Gateway account. Requires anonymousAuth to be performed first. |
*DefaultApi* | [**getArtifacts**](Apis/DefaultApi.md#getartifacts) | **GET** /artifacts | Get wallet seed encryption artifacts. |
*DefaultApi* | [**getSessionArtifacts**](Apis/DefaultApi.md#getsessionartifacts) | **GET** /session-artifacts | Get wallet seed encryption artifacts for the current session. |
*DefaultApi* | [**login**](Apis/DefaultApi.md#login) | **POST** /login | Login to user's account by providing a message signed by the associated blockchain account. |
*DefaultApi* | [**logout**](Apis/DefaultApi.md#logout) | **POST** /logout | Terminate the current session. |
*DefaultApi* | [**postSessionArtifacts**](Apis/DefaultApi.md#postsessionartifacts) | **POST** /session-artifacts | Save wallet seed encryption artifacts for the current session on the server. |
*DefaultApi* | [**requestEmailConfirmationToken**](Apis/DefaultApi.md#requestemailconfirmationtoken) | **POST** /request-email-confirmation-token | Request a token to be sent to account's e-mail address, which will allow confirming the ownership of the e-mail by the user. |


<a name="documentation-for-models"></a>
## Documentation for Models

 - [ActionExecutionPayload](./Models/ActionExecutionPayload.md)
 - [ActionExecutionRequestData](./Models/ActionExecutionRequestData.md)
 - [AnonymousUserAuthRequestData](./Models/AnonymousUserAuthRequestData.md)
 - [AnonymousUserAuthResponseData](./Models/AnonymousUserAuthResponseData.md)
 - [AnonymousUserAuthResponseData_allOf](./Models/AnonymousUserAuthResponseData_allOf.md)
 - [ChangeAccountRequestData](./Models/ChangeAccountRequestData.md)
 - [ChangeAccountRequestData_allOf](./Models/ChangeAccountRequestData_allOf.md)
 - [ConfirmEmailRequestData](./Models/ConfirmEmailRequestData.md)
 - [CreateAccountRequestData](./Models/CreateAccountRequestData.md)
 - [CreateAccountRequestData_allOf](./Models/CreateAccountRequestData_allOf.md)
 - [EncryptionArtifacts](./Models/EncryptionArtifacts.md)
 - [GenericErrorResponseData](./Models/GenericErrorResponseData.md)
 - [GenericOkResponseData](./Models/GenericOkResponseData.md)
 - [LoginRequestData](./Models/LoginRequestData.md)
 - [LoginRequestData_allOf](./Models/LoginRequestData_allOf.md)
 - [LoginResponseData](./Models/LoginResponseData.md)
 - [RequestTokenRequestData](./Models/RequestTokenRequestData.md)
 - [SessionEncryptionArtifacts](./Models/SessionEncryptionArtifacts.md)


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

