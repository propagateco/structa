import { X as XMLParser } from "../../../_libs/fast-xml-parser.mjs";
const parser = new XMLParser({
  attributeNamePrefix: "",
  htmlEntities: true,
  ignoreAttributes: false,
  ignoreDeclaration: true,
  parseTagValue: false,
  trimValues: false,
  tagValueProcessor: (_, val) => val.trim() === "" && val.includes("\n") ? "" : void 0
});
parser.addEntity("#xD", "\r");
parser.addEntity("#10", "\n");
function parseXML(xmlString) {
  return parser.parse(xmlString, true);
}
export {
  parseXML as p
};
