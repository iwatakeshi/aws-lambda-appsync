export interface AppsyncClientOptions<T> {
  url: string,
  auth: T,
  disableOffline?: boolean
}
