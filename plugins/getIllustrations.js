  const getIllustrations = async (illuHandles) => {
    function functionWithPromise(handle) {
        try {
          return import("~/assets/svg/products/" + handle + ".svg?raw");
        } catch (err) {
          console.log(err);
          return null;
        }
      };

    async function anAsyncFunction(handle){
        return functionWithPromise(handle);
      };
    
    return Promise.all(
      illuHandles.map(handle => {
        return anAsyncFunction(handle);
      })
    );
  };

  export default getIllustrations