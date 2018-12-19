keyPath="android/keystores/release.keystore"
rm "$keyPath"
keytool -genkey -keystore "$keyPath" -storepass "$TAKEY_PASSWORD" -alias "$TAKEY_ALIAS" -keypass "$TAKEY_PASSWORD" -dname "CN=JSmartX,O=JSmartX Inc.,ST=Shanghai,C=CN"