# One-time Payment (OTP) Sharepoint Simulator
This is a small file-based HTML site meant to simulate the Sharepoint portal experience for the One-time Payment 
application.

## Usage
In order to take advantage of this simulator we'll need to inject the actual module code being used 
and config where the underlying web services are being served from.

To streamline the process we'll be enforcing a convention that allows each developer to get started quickly with
their own development space.

### Installation
In order to access the other components this project desires to have the following project location structure:
```
workspace
	|_ BTRJavaScript
	|_ SiteAssets
		|_ BTR
			|_ js (symlink to BTRJavaScript)
	|_ TC_OTP

// For clairity, `workspace` simply refers to some directory within which the repositories have been cloned.
```

From an empty `workspace` directory when can build the structure by
1. Clone the [BTRJavaScript](https://github.com/kj07208/BTRJavaScript) repository into the `workspace` directory.
2. Create a symbolic link back to the `BTRJavaScript` using from an administrator command terminal:
```bash
C:\Users\home> cd \path\to\workspace
C:\path\to\workspace> mkdir SiteAssets\BTR
C:\path\to\workspace> mklink /d SiteAssets\BTR\js \path\to\workspace\BTRJavaScript
C:\path\to\workspace> dir SiteAssets\BTR
    ...
    2017-07-06  10:00  <SYMLINK>  js [\path\to\workspace\BTRJavaScript]
    ...
```
3. Clone the [TC_OTP](https://github.com/kj07208/TC_OTP) repository into the `workspace` directory.
4. Open the main HTML file in an internet browser by going to `file:///C:/path/to/workspace/TC_OTP/otp_form.html`.
---
#### Teachers College - Columbia University 
#### One-time Payment Module