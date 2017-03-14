package com.welone.weibo;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import com.sina.weibo.sdk.auth.AuthInfo;
import com.sina.weibo.sdk.auth.Oauth2AccessToken;
import com.sina.weibo.sdk.auth.WeiboAuthListener;
import com.sina.weibo.sdk.auth.sso.SsoHandler;
import com.sina.weibo.sdk.exception.WeiboException;
import com.sina.weibo.sdk.openapi.CommentsAPI;
import com.sina.weibo.sdk.openapi.StatusesAPI;
import com.sina.weibo.sdk.openapi.UsersAPI;


/**
 * Created by Tianchi on 17/1/9.
 * <p>
 * Encapsulate Weibo api for react-native
 */

public class WeiboModule extends ReactContextBaseJavaModule {

    private final int AUTH_PREQUEST = 32973;

    private AuthInfo mAuthInfo = null;

    //注意：SsoHandler 仅当 SDK 支持 SSO 时有效
    private SsoHandler mSsoHandler = null;
    //User API
    private UsersAPI mUsersAPI = null;
    //Statuses API
    private StatusesAPI mStatusesAPI = null;
    //Comments API
    private CommentsAPI mCommentsAPI = null;

    private final static String LOG_TAG = "welone";

    public WeiboModule(ReactApplicationContext reactContext) {
        super(reactContext);


        // Add the listener for `onActivityResult`
        reactContext.addActivityEventListener(mActivityEventListener);
    }

    @Override
    public String getName() {
        return "WeiboModule";
    }

    private final ActivityEventListener mActivityEventListener = new BaseActivityEventListener() {

        @Override
        public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
            if (requestCode == AUTH_PREQUEST) {
                // SSO 授权回调
                // 重要：发起 SSO 登陆的 Activity 必须重写 onActivityResults
                if (mSsoHandler != null) {
                    mSsoHandler.authorizeCallBack(requestCode, resultCode, data);
                }
            }
        }
    };

    /**
     * 微博认证授权回调类。
     * 1. SSO 授权时，需要在 {onActivityResult} 中调用 {@link SsoHandler#authorizeCallBack} 后，
     * 该回调才会被执行。
     * 2. 非 SSO 授权时，当授权结束后，该回调就会被执行。
     * 当授权成功后，请保存该 access_token、expires_in、uid 等信息到 SharedPreferences 中。
     */
    private class AuthListener implements WeiboAuthListener {

        Callback successCallback = null;
        Callback errorCallback = null;

        AuthListener(Callback scb, Callback ecb) {
            successCallback = scb;
            errorCallback = ecb;
        }

        @Override
        public void onComplete(Bundle values) {
            //parse token from Bundle
            Oauth2AccessToken accessToken = Oauth2AccessToken.parseAccessToken(values);

            String phoneNum = accessToken.getPhoneNum();
            if (accessToken.isSessionValid()) {
                // save Token in SharedPreferences
                AccessTokenKeeper.writeAccessToken(getCurrentActivity(), accessToken);
                if (successCallback != null)
                    successCallback.invoke("Authorized successfully");
            } else {
                // 以下几种情况，您会收到 Code：
                // 1. 当您未在平台上注册的应用程序的包名与签名时；
                // 2. 当您注册的应用程序包名与签名不正确时；
                // 3. 当您在平台上注册的包名和签名与您当前测试的应用的包名和签名不匹配时。
                String code = values.getString("code");
                String message = "";
                if (!TextUtils.isEmpty(code)) {
                    message = message + "\nObtained the code: " + code;
                }
                if (errorCallback != null)
                    errorCallback.invoke("Authorized unsuccessfully: " + message);
            }
        }

        @Override
        public void onCancel() {
            if (errorCallback != null)
                errorCallback.invoke("Authorization is canceled");
        }

        @Override
        public void onWeiboException(WeiboException e) {
            if (errorCallback != null)
                errorCallback.invoke("Authorized unsuccessfully: " + e.toString());
        }
    }


    /**React Method **/

    /**
     * User authorize weibo
     *
     * @param successCallback
     * @param errorCallback
     */
    @ReactMethod
    public void login(Callback successCallback, Callback errorCallback) {
        Activity activity = getCurrentActivity();
        if (activity == null) {
            errorCallback.invoke("Authorized unsuccessfully: The current activity is null");
            return;
        }
        if (mAuthInfo == null)
            mAuthInfo = new AuthInfo(activity, Constants.APP_KEY, Constants.REDIRECT_URL, Constants.SCOPE);
        if (mSsoHandler == null)
            mSsoHandler = new SsoHandler(activity, mAuthInfo);

        Oauth2AccessToken token = AccessTokenKeeper.readAccessToken(activity);
        if (token.isSessionValid()) {
            successCallback.invoke("Authorized successfully");
            return;
        }

        mSsoHandler.authorize(new AuthListener(successCallback, errorCallback));
    }


    @ReactMethod
    public void logout(Callback callback) {
        Activity activity = getCurrentActivity();
        if (activity == null) {
            callback.invoke(false);
            return;
        }
        mAuthInfo = null;
        mSsoHandler = null;
        mUsersAPI = null;
        mStatusesAPI = null;
        AccessTokenKeeper.clear(activity);
        callback.invoke(true);
    }

    @ReactMethod
    public void isLogin(Callback callback) {
        Activity activity = getCurrentActivity();
        if (activity == null) {
            callback.invoke(false);
            return;
        }

        Oauth2AccessToken token = AccessTokenKeeper.readAccessToken(activity);
        if (token != null && token.isSessionValid()) {
            callback.invoke(true);
        } else {
            callback.invoke(false);
        }
    }

    @ReactMethod
    public void getUserInfo(Callback successCallback, Callback errorCallback) {
        Oauth2AccessToken token = AccessTokenKeeper.getAccessToken();
        if (token != null && token.isSessionValid()) {
            if (mUsersAPI == null) {
                mUsersAPI = new UsersAPI(getCurrentActivity(), Constants.APP_KEY, token); // 获取用户信息接口
            }
            try {
                long uid = Long.parseLong(token.getUid());
                String info = mUsersAPI.showSync(uid);
                if (info != null && info.length() > 0) {
                    successCallback.invoke(info);
                } else {
                    errorCallback.invoke("Get user info error..");
                }
            } catch (com.sina.weibo.sdk.exception.WeiboException e) {
                errorCallback.invoke("Please open the Internet :)");
            }
        } else {
            errorCallback.invoke("Get user information: token error..");
        }
    }

    @ReactMethod
    public void getTimeline(String sinceId, String maxId, Callback successCallback, Callback errorCallback) {
        Oauth2AccessToken token = AccessTokenKeeper.getAccessToken();
        if (token != null && token.isSessionValid()) {
            if (mStatusesAPI == null) {
                mStatusesAPI = new StatusesAPI(getCurrentActivity(), Constants.APP_KEY, token);
            }
            try {
                long since = Long.parseLong(sinceId);
                long max = Long.parseLong(maxId);
                String info = mStatusesAPI.friendsTimelineSync(since, max, 20, 1, false, 0, false);
                if (info != null && info.length() > 0) {
                    successCallback.invoke(info);
                } else {
                    errorCallback.invoke("Get weibo error..");
                }
            } catch (com.sina.weibo.sdk.exception.WeiboException e) {
                errorCallback.invoke("Please open the Internet :)");
            }
        } else {
            errorCallback.invoke("Get user information: token error..");
        }
    }

    @ReactMethod
    public void getShow(String ids, String sinceId, String maxId, Callback successCallback, Callback errorCallback) {
        Oauth2AccessToken token = AccessTokenKeeper.getAccessToken();
        if (token != null && token.isSessionValid()) {
            if (mCommentsAPI == null) {
                mCommentsAPI = new CommentsAPI(getCurrentActivity(), Constants.APP_KEY, token);
            }
            try {
                long id = Long.parseLong(ids);
                long since = Long.parseLong(sinceId);
                long max = Long.parseLong(maxId);
                String info = mCommentsAPI.showSync(id, since, max, 10, 1, 0);
                if (info != null && info.length() > 0) {
                    successCallback.invoke(info);
                } else {
                    errorCallback.invoke("Get comments error..");
                }
            } catch (com.sina.weibo.sdk.exception.WeiboException e) {
                errorCallback.invoke("Please open the Internet :)");
            }
        } else {
            errorCallback.invoke("Get user information: token error..");
        }
    }

}
