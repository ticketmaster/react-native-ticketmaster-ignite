# Running the demo apps

To run the React Native example app:

Clone the project and then

```bash
cd react-native-ticketmaster-ignite
yarn
cd example/ios
pod install
yarn start
```
Then run the project with either `yarn android`/`yarn ios` or building the app in Android Studio/Xcode.

To run the Expo app: 
Clone the project and then

```bash
cd react-native-ticketmaster-ignite
yarn
cd expo
```
Then run the project with either `yarn expo:android`/`yarn expo:ios`

Both apps read their API key and demo IDs from a `.env` file. See [Environment variables](../README.md#environment-variables) in the README for the values to set.
