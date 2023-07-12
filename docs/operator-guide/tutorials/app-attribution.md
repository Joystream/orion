# App attribution

Orion GraphQL API includes `signAppActionCommitment` mutation which is used by the [Atlas](https://github.com/Joystream/atlas) instance connected to it for signing the metadata of `create_channel` / `create_video` transactions in a way which allows attributing a video / channel to a Gateway on which it was created. The private key used for generating those signatures is derived from the `APP_PRIVATE_KEY` environment variable.

There are many reasons why you might want to make use of this feature as a Gateway operator. One of them being: it's the simplest way to prove that a given subset of videos / channels was created through your Gateway, allowing the DAO to more fairly reward you for your contribution to the Joystream network.

## Setting up

1. The first step is to generate a securely random string that will be used as `APP_PRIVATE_KEY` environment variable value. For this purpose we recommend using `openssl`, for example:
    ```bash
    $ openssl rand -base64 18
    YGcFDGsvFVw2MIvnOK+20pd7
    ```
    You should assign the output of this command to the `APP_PRIVATE_KEY` environment variable in your `.env` file and never share it with anyone.
1. You now need to retrieve the Orion public key corresponding to the private key derived from the string you just generated. You can get it by running the following command:
    ```bash
    $ docker run --rm joystream/orion npm run get-public-key YGcFDGsvFVw2MIvnOK+20pd7
    0x4914e1421705decf920439aee7ab229ae0541ab8ee867d75e7b6edc7759ecd43
    ```
    _(replacing `YGcFDGsvFVw2MIvnOK+20pd7` with the string you actually generated in the previous step)_
1. In order for event processors (and humans) to be able to verify and understand that the signatures provided by your Orion instance are indeed related to your Gateway, you should create an `App` entity using a `member_remark` transanction containing a [`CreateApp` protobuf message](https://github.com/Joystream/joystream/blob/master/metadata-protobuf/proto/Metaprotocol.proto#L147). The simplest way to do this is through [Joystream CLI](https://www.npmjs.com/package/@joystream/cli):
    1. First prepare a JSON file with you App (Gateway) metadata in the following format:
        ```json
        {
          "name": "MyGateway",
          "authKey": "0x4914e1421705decf920439aee7ab229ae0541ab8ee867d75e7b6edc7759ecd43",
          "description": "An example, imaginary Gateway created for the purpose of Orion Operator Guide in order to provide a better reader experience.",
          "category": "Education",
          "oneLiner": "This could be YOUR Gateway!",
          "platforms": [
              "web",
              "mobile"
          ],
          "websiteUrl": "https://mygateway-inc.org",
          "useUri": "https://mygateway.com",
          "smallIcon": "https://mygateway.com/assets/small_icon.png",
          "mediumIcon": "https://mygateway.com/assets/medium_icon.png",
          "bigIcon": "https://mygateway.com/assets/big_icon.png",
          "termsOfService": "https://mygateway.com/terms",
        }
        ```
        The key fields are `name` and `authKey`, everything else can be skipped.
        You should replace `authKey` value with the public key you retrieved in the previous step and adjust the other values to be relevant to your actual Gateway.
    1. Install Joystream CLI:
        ```bash
        # If you don't have Node.js and NPM installed yet, you can install it using Volta:
        # curl https://get.volta.sh | bash
        # source ~/.bash_profile || source ~/.profile || source ~/.bashrc || :
        # volta install node

        npm install -g @joystream/cli

        ```
    1. Follow the steps described in _[First steps](https://github.com/Joystream/joystream/tree/master/cli#first-steps)_ section of the Joystream CLI documentation. If your trying to create your app on Joystream mainnet, you should import your member controller account using [`joystream-cli account:import`](https://github.com/Joystream/joystream/tree/master/cli#joystream-cli-accountimport) command.
    1. Now you can execute the following command to create your App:
        ```bash
        joystream-cli apps:createApp -i /path/to/your/app.json
        ```
        _(replace `/path/to/your/app.json` with the actual path to the JSON file you created in the first step)_

To verify whether your App was created successfully, you can execute the following query against the GraphQL API of any Orion instance processing the same chain that you issued the App creation transaction on (if we're talking about production deployments, you can use any instance processing Joystream mainnet blockchain events, like https://orion.joystream.org/graphql or your own instance):
```graphql
{
  apps(where: { name_eq: "<YOUR_APP_NAME>" }) {
    id
    name
    ownerMember { id }
    websiteUrl
    useUri
    smallIcon
    mediumIcon
    bigIcon
    oneLiner
    description
    termsOfService
    platforms
    category
    authKey
  }
}
```
_(replacing `<YOUR_APP_NAME>` with the actual name of your App that you specified in the JSON file)_

Note that it may take a minute or two for your transaction to be processed.
If after a few minutes you still can't see your App it could be an indication that the metaprotocol transaction wasn't successful. In that case you can try to create the app again with minimal metadata (for example, just `name` and `authKey`). Once the app is successfuly created, you can always update it later using [`joystream-cli apps:updateApp`](https://github.com/Joystream/joystream/tree/master/cli#joystream-cli-appsupdateapp) command.

Once you successfuly executed all the steps and your Orion is set up with the right `APP_PRIVATE_KEY` value, the videos and channels created through your Gateway (via Atlas) should be correctly attributed to it.

To check which channels and videos have been already attributed to your app, you can execute the following query:
```graphql
{
  videos(where: { entryApp: { name_eq: "<YOUR_APP_NAME>" } }) {
    id
    title
  }
	channels(where: { entryApp: { name_eq: "<YOUR_APP_NAME>" } }) {
    id
    title
  }
}
```
_(replacing `<YOUR_APP_NAME>` with the actual name of your App that you specified in the JSON file)_