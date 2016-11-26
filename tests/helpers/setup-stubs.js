export default function setupStubs(objects) {
  const stubbedCalls = {};
  const stubbedObjects = {};

  objects.forEach(function(object) {
    stubbedCalls[object.name] = {};
    stubbedObjects[object.name] = {};

    if (object.methods) {
      object.methods.forEach(function(method) {
        stubbedCalls[object.name][method] = [];

        stubbedObjects[object.name][method] = function(...args) {
          stubbedCalls[object.name][method].push(args);
        };
      });
    }

    if (object.methodOverrides) {
      object.methodOverrides.forEach(function(methodOverride) {
        stubbedCalls[object.name][methodOverride.name] = [];

        stubbedObjects[object.name][methodOverride.name] = function(...args) {
          stubbedCalls[object.name][methodOverride.name].push(args);
          return methodOverride.override(...args);
        };
      });
    }
  });

  return { calls: stubbedCalls, objects: stubbedObjects };
}
