/**
 * @type {import('@remix-run/dev/config').AppConfig}
 */
module.exports = {
    server: "./server.js",
    ignoredRouteFiles: [".*"],
    devServerBroadcastDelay: 1000,
    // appDirectory: "app",
    // browserBuildDirectory: "public/build",
    // publicPath: "/build/",
    // serverBuildDirectory: "build",
    devServerPort: 9082,
};
