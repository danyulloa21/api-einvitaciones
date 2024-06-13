function extraerParametrosURL() {
    const dataParamsURL = new URLSearchParams(window.location.search);
    const dataParams = Object.fromEntries(dataParamsURL.entries());
    console.log(`Data decodificada ${JSON.stringify(dataParams)}`);
    try {
      if (dataParams.tk) {
        const tokenDecoded = atob(dataParams.tk);
        const tokenDecodedDouble = atob(tokenDecoded);
        return JSON.parse(tokenDecodedDouble);
      }
    } catch (error) {
      console.error('Los datos necesarios no están disponibles');
      document.body.innerHTML = '<h1>Esta página no está disponible</h1>';
      throw error; // Detiene la ejecución del script
    }
    return dataParams;
  }

  const datos = extraerParametrosURL();

  console.log(datos)
  document.getElementById('titulo').innerText += datos.id;
  document.getElementById('datos-name').innerText += datos.ni;
  document.getElementById('datos-acompanante').innerText += datos.acmp;
  document.getElementById('datos-mesa').innerText += datos.m;