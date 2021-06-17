export default class TrixiServerError extends Error {
  public date: Date;

  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TrixiServerError);
    }

    this.name = "TrixiServerError";
    this.date = new Date();
  }
}