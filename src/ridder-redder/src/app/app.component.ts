import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

import { HomePage } from '../pages/home/home';
import { CombatPage } from '../pages/combat/combat';

@Component({
    templateUrl: 'app.html'
})
export class RidderRedder {
    
  rootPage:any = CombatPage;


    constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private screenOrientation: ScreenOrientation) {
        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);

            statusBar.styleDefault();
            splashScreen.hide();
        });
    }
}

