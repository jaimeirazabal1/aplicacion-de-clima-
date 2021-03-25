require('dotenv').config();

const { leerInput, inquirerMenu, pausa, listarLugares  } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");

const main = async () => {
    let opt;
    const busquedas = new Busquedas();

    do {
        opt = await inquirerMenu();

        switch(opt){
            case 1:
                // mostrar mensaje
                const lugar = await leerInput('Ciudad: ');
                // console.log({lugar});

                const lugares = await busquedas.ciudad(lugar);

                const id = await listarLugares(lugares);

                if(id === '0') continue;
                
                const lugarSeleccionado = lugares.find( l => l.id === id );

                //guardar en db
                busquedas.agregarHistorial( lugarSeleccionado.nombre );

                // console.log(lugarSeleccionado)
                // buscar los lugares

                // seleccionar el lugar

                // clima
                const clima = await busquedas.climaLugar(lugarSeleccionado.lat, lugarSeleccionado.lng);
                console.clear();
                // mostrar ressultados

                console.log('\ninformacion de la ciudad\n'.green);

                console.log('Ciudad: ',lugarSeleccionado.nombre);
                console.log('Lat: ',lugarSeleccionado.lat);
                console.log('Lng: ',lugarSeleccionado.lng);
                console.log('Temperatura: ',clima.temp);
                console.log('Minima: ',clima.min);
                console.log('Maxima: ',clima.max);
                console.log('Como esta el clima: ',clima.desc);

                break;
            case 2:
                const capitalizado = busquedas.historialCapitalizado();
                capitalizado.forEach( (lugar,i) => {
                    const idx = `${ i + 1 }.`.green;
                    console.log(`${idx} ${ lugar }`)
                })
                break;
        }

        // console.log({opt});
        
        if(opt !== 0) await pausa();
        

    } while (opt !== 0);
}

main();