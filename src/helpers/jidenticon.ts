import {toPng} from "jdenticon";

const ICON_SIZE = 100;
export function generateIdenticon(value: string): Buffer {
    return toPng(value, ICON_SIZE)
}