export function getProperties(schema: Record<string, any>) {
  const referenceKey = "$ref";
  const { properties, definitions } = schema;
  const result = { ...schema };

  function getDefinitionKey(inputString: string) {
    const refKey = inputString.split("/");
    return refKey[refKey.length - 1];
  }

  function getDefinitionProperties(definition: Record<string, any>) {
    const result = { ...definition };
    const { required, properties } = result;

    // populate required key to obj
    if (required) {
      required.forEach((key: string) => (properties[key]["required"] = true));
    }

    // check for nested $ref
    for (const prop in properties) {
      if (properties[prop][referenceKey]) {
        const key = getDefinitionKey(properties[prop][referenceKey]);
        const def = definitions[key];
        properties[prop] = { ...properties[prop], ...getDefinitionProperties(def) };
      }
    }
    return result;
  }

  for (const propKey in properties) {
    const property = properties[propKey];
    let referenceKeyArray: [];
    if (property["allOf"]) {
      const referenceArray = property["allOf"];
      referenceKeyArray = referenceArray.map((item: Record<string, any>) => getDefinitionKey(item["$ref"]));
      referenceKeyArray.forEach((key) => {
        const definition = definitions[key];
        if (definition) {
          result.properties[propKey] = getDefinitionProperties(definition);
        }
      });
    }
  }
  return result.properties;
}
