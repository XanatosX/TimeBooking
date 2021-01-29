const { remote } = require("electron");
const { Themebar } = require("custom-electron-titlebar");
const CustomTitlebar = require("custom-electron-titlebar");
const IconUtil = require("../classes/util/IconUtil");


document.addEventListener("DOMContentLoaded", function () {
    let platform = process.platform;
    let color = remote.nativeTheme.shouldUseDarkColors ? "#444" : "#fff";
    IconUtil.setIsDark(remote.nativeTheme.shouldUseDarkColors);
    let themebar = null;
    switch (platform) {
        case "darwin":
            themebar = Themebar.mac;
            break;
        default:
            themebar = Themebar.win;
            break;
    }
    new CustomTitlebar.Titlebar({
        backgroundColor: CustomTitlebar.Color.fromHex(color),
        iconsTheme: themebar
        //icon: IconUtil.getIcon("application.png")
    });
});
