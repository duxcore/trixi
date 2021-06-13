import { PayloadObject } from "../types/Payload";
import * as uuid from 'uuid';

export default function createPayload(op, payload?, ref?): PayloadObject {
  return {
    op: op,
    p: payload ?? null,
    ref: ref ?? uuid.v4()
  };
}