package work.goodday.m.app;

import android.app.Application;

import com.facebook.react.ReactApplication;
import io.github.elyx0.reactnativedocumentpicker.DocumentPickerPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.reactnativecommunity.netinfo.NetInfoPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import co.apptailor.googlesignin.RNGoogleSigninPackage;

import java.util.Arrays;
import java.util.List;

import com.evollu.react.fcm.FIRMessagingPackage;
import com.mehcode.reactnative.splashscreen.SplashScreenPackage;
import io.sentry.RNSentryPackage;
import com.levelasquez.androidopensettings.AndroidOpenSettingsPackage;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new DocumentPickerPackage(),
            new LinearGradientPackage(),
          new NetInfoPackage(),
          new AsyncStoragePackage(),
          new SplashScreenPackage(),
          new FIRMessagingPackage(),
          new AndroidOpenSettingsPackage(),
          new RNSentryPackage(),
          new RNGoogleSigninPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
