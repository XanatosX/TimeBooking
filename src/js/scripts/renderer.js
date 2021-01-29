const { Themebar } = require('custom-electron-titlebar');
const IconUtil = require('../classes/util/IconUtil');
const CustomTitlebar = require('custom-electron-titlebar');
const { remote } = require('electron');

document.addEventListener('DOMContentLoaded', function () {
    let platform = process.platform;
    let color = remote.nativeTheme.shouldUseDarkColors ? '#444' : '#fff';
    IconUtil.isDark(remote.nativeTheme.shouldUseDarkColors);
    let themebar = null;
    switch (platform) {
        case "darwin":
            themebar = Themebar.mac
            break;
        default:
            themebar = Themebar.win
            break;
    }
    console.log(platform);
    new CustomTitlebar.Titlebar({
        backgroundColor: CustomTitlebar.Color.fromHex(color),
        iconsTheme: themebar,
        icon: IconUtil.getIcon("application.ico")
    });
});
