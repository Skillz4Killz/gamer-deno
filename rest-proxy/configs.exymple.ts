export const configs = {
  /** The port number where the server will be hosted. */
  port: 7145,
  /** The authorization secret key that all requests must provide in its headers. This prevents anyone from making your server do something. */
  authorization: "",
  /** The bot token that will be used for authorization. */
  token: "",
  /** When a request is rate limited, how many times should it keep retrying the request. Recommended: 10 */
  maxRetryCount: 10,
  /** The api version you would like to use */
  apiVersion: 8,
};
