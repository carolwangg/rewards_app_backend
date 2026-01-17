// import {toPng} from "jdenticon";
// import { randomUUID } from "node:crypto";
// import awsS3 from "./clients/awsS3.ts";
// import db from "./clients/database.ts";

// const ICON_SIZE = 100;

// const data = {
//     id: "user_37wSDBG1jSyh4srW6PSofUpMR93",
//     email: "carolzjwang@gmail.com",
//     name: "Carol Wang",
//     country: "CA"
// }

// export function generateIdenticon(value) {
//     return toPng(value, ICON_SIZE)
// }


// await awsS3.deleteObject('https://rewards-app-dev.s3.us-east-2.amazonaws.com/images/user_37wSDBG1jSyh4srW6PSofUpMR93/pfp-1aa1fd01-5ecd-429a-9c38-ca9303996a0d')
// const id = randomUUID();
// const image = generateIdenticon(data.name);
// const file_name = `images/${data.id}/pfp-${id}`;
// const folder_name = `images/${data.id}`;
// console.log(image);
// const makeDirResult = await awsS3.makeFolder(folder_name);
// const putObjectResult = await awsS3.putObject(image, file_name);
// console.log(putObjectResult);
// const image_url = putObjectResult.url;

// const db_result = await db.updateCustomer(data.id, data.email, data.country, data.name, 0, 0, "", image_url);
// console.log("Customer created");
// console.log("MySQL:"+db_result);

import {generateIdenticon} from './helpers/jidenticon.ts'

generateIdenticon()