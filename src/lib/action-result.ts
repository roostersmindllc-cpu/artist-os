export type ActionResult<TData = undefined> =
  | {
      success: true;
      message: string;
      data?: TData;
    }
  | {
      success: false;
      error: string;
    };
