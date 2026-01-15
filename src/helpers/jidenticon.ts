import jdenticon from "jdenticon";

const ICON_SIZE = 100;

export function generateIdenticon(value: string): Buffer {
    return jdenticon.toPng(value, ICON_SIZE)
}