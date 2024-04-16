const modules = import.meta.glob(['./protocol/*.ts']);
for (const path in modules) {
  modules[path]().then((mod) => {
    console.log(path, mod);
  });
}
