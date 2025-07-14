# Javelin Training Checklist

This repository contains a small progressive web app (PWA) that helps organize daily javelin training tasks.

## Wrapping the PWA as an Android app

If you want to distribute the checklist through the Google Play Store, you can package the website as an Android application. Two common options are a Trusted Web Activity (TWA) or a simple WebView wrapper.

### Trusted Web Activity

A TWA launches Chrome in full screen with no browser UI, providing the most "native" experience for PWAs. Your site must be served over **HTTPS** and expose a valid `manifest.json` with fields such as `name`, `short_name`, `start_url` and icon entries. The manifest in this repository already includes these basics and sets `display` to `standalone`.

To build a TWA, follow Google’s official guide:
<https://developer.chrome.com/docs/android/trusted-web-activity/>

Tools like Bubblewrap help generate the necessary Android project and Digital Asset Links for verification between your domain and the application.

### WebView wrapper

For more control or when your PWA doesn’t meet TWA requirements, you can build a regular Android app and embed the website in a `WebView`. The WebView should load your **HTTPS** origin and can expose native capabilities if needed.

See the Android developer documentation for details:
<https://developer.android.com/guide/webapps/webview>

