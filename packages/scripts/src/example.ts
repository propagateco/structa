import { Resource } from "sst";
import { Example } from "@structa/core/example";

console.log(`${Example.hello()} Linked to ${Resource.MyBucket.name}.`);
