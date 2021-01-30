const { remote } = require("electron");
const { Themebar, Titlebar } = require("custom-electron-titlebar");
const CustomTitlebar = require("custom-electron-titlebar");
const IconUtil = require("../classes/util/IconUtil");


document.addEventListener("DOMContentLoaded", function () {
    let platform = process.platform;
    let color = remote.nativeTheme.shouldUseDarkColors ? "#444" : "#fff";
    IconUtil.setIsDark(remote.nativeTheme.shouldUseDarkColors);
    console.log(IconUtil.getIcon("application.png"));
    console.log(__dirname);
    console.log(IconUtil.getUrlRelativeIconPath(__dirname + "/../", "application.png"));
    let themebar = null;
    switch (platform) {
        case "darwin":
            themebar = Themebar.mac;
            break;
        default:
            themebar = Themebar.win;
            break;
    }
    console.log(IconUtil.getIcon("application.png"));
    new CustomTitlebar.Titlebar({
        backgroundColor: CustomTitlebar.Color.fromHex(color),
        iconsTheme: themebar,
        icon: IconUtil.getUrlRelativeIconPath(__dirname + "/../", "application.png")
    });
});
