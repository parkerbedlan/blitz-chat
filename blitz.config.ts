import { BlitzConfig, sessionMiddleware, simpleRolesIsAuthorized, connectMiddleware } from "blitz"
import cors from "cors"

const config: BlitzConfig = {
  middleware: [
    sessionMiddleware({
      cookiePrefix: "blitzChat",
      isAuthorized: simpleRolesIsAuthorized,
      secureCookies: process.env.NODE_ENV === "production",
      domain: process.env.NODE_ENV === "production" ? ".sloper.us" : undefined,
    }),
    // connectMiddleware(
    //   cors({
    //     origin: (_, callback) => callback(null, true),
    //     credentials: true,
    //   })
    // ),
  ],
  /* Uncomment this to customize the webpack config
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Note: we provide webpack above so you should not `require` it
    // Perform customizations to webpack config
    // Important: return the modified config
    return config
  },
  */
}
module.exports = config
